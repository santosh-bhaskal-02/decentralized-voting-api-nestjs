import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Vote } from './entities/vote.entity';
import { Candidate } from '../candidate/entities/candidate.entity';
import { User } from '../user/entities/user.entity';
import { VoteGateway } from './vote.gateway';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly voteGateway: VoteGateway,
  ) {}

  // Fetch candidates, optionally filtered by constituency from voterCardNumber
  async getCandidates(voterCardNumber?: string, electionType?: string) {
    const query = this.candidateRepository.createQueryBuilder('candidate');

    if (electionType) {
      query.andWhere('candidate.electionType = :electionType', {
        electionType: electionType.trim(),
      });
    }

    if (voterCardNumber) {
      const voter = await this.userRepository.findOne({
        where: { voterCardNumber: voterCardNumber.trim() },
      });

      if (voter && voter.constituency) {
        query.andWhere('candidate.constituency = :constituency', {
          constituency: voter.constituency,
        });
      }
    }

    return await query.getMany();
  }

  // Cast vote, secure in blockchain, and update database states
  async castVote(voterCardNumber: string, candidateId: number) {
    if (!voterCardNumber || !candidateId) {
      throw new BadRequestException('Voter Card Number and Candidate are required');
    }

    const voter = await this.userRepository.findOne({
      where: { voterCardNumber: voterCardNumber.trim() },
    });

    if (!voter) {
      throw new NotFoundException('Voter not found');
    }

    if (!voter.isApproved) {
      throw new BadRequestException('Voter is not approved');
    }

    if (voter.hasVoted) {
      throw new BadRequestException('You have already voted');
    }

    const candidate = await this.candidateRepository.findOne({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    // Get last block to construct chain link
    const lastVote = await this.voteRepository.findOne({
      order: { id: 'DESC' },
      where: {},
    });

    const previousHash = lastVote ? lastVote.hash : '0000000000000000000000000000000000000000000000000000000000000000';

    const vote = new Vote();
    vote.candidateId = candidate.id;
    vote.constituency = voter.constituency;
    vote.voteDate = new Date();
    vote.previousHash = previousHash;
    vote.hash = this.calculateHash(vote);

    // Persist vote and update voter status
    await this.voteRepository.save(vote);
    voter.hasVoted = true;
    await this.userRepository.save(voter);

    // Real-time broadcast of results updates to all UI clients
    const liveResults = await this.getResults();
    this.voteGateway.broadcast('resultsUpdated', liveResults);
    this.voteGateway.broadcast('voteCast', { hash: vote.hash, constituency: vote.constituency });

    return {
      message: 'Vote cast successfully and secured in blockchain',
      hash: vote.hash,
    };
  }

  // Verify blockchain integrity by verifying hashes sequentially
  async verifyBlockchain() {
    const votes = await this.voteRepository.find({ order: { id: 'ASC' } });
    let isValid = true;

    for (let i = 0; i < votes.length; i++) {
      const currentVote = votes[i];
      
      // Calculate current hash based on values
      const calculatedHash = this.calculateHash(currentVote);
      if (currentVote.hash !== calculatedHash) {
        isValid = false;
        break;
      }

      // Verify chain connection
      if (i > 0) {
        const previousVote = votes[i - 1];
        if (currentVote.previousHash !== previousVote.hash) {
          isValid = false;
          break;
        }
      }
    }

    return {
      isValid,
      count: votes.length,
      timestamp: new Date(),
    };
  }

  // Get raw ledger audit trail
  async getAuditTrail() {
    return await this.voteRepository.find({ order: { id: 'ASC' } });
  }

  // Aggregate results and calculate winner/ties
  async getResults() {
    const candidates = await this.candidateRepository.find();
    const votes = await this.voteRepository.find();

    const candidateResults = candidates.map((c) => {
      const voteCount = votes.filter((v) => v.candidateId === c.id).length;
      return {
        id: c.id,
        candidateName: c.name,
        partyName: c.party,
        constituency: c.constituency || 'General',
        electionType: c.electionType,
        votes: voteCount,
      };
    });

    // Group candidates by constituency + electionType
    const groupedMap = new Map<string, typeof candidateResults>();
    candidateResults.forEach((res) => {
      const key = `${res.constituency}-${res.electionType}`;
      const group = groupedMap.get(key) || [];
      group.push(res);
      groupedMap.set(key, group);
    });

    const groupedResults: any[] = [];
    groupedMap.forEach((results, key) => {
      const [constituency, electionType] = key.split('-');
      const sortedResults = results.sort((a, b) => b.votes - a.votes);
      const maxVotes = sortedResults.length > 0 ? sortedResults[0].votes : 0;
      
      const topCandidates = sortedResults.filter((r) => r.votes === maxVotes);
      const isTie = maxVotes > 0 && topCandidates.length > 1;
      let winner: any = null;
      let tieResolved = false;

      if (maxVotes > 0) {
        if (topCandidates.length === 1) {
          winner = topCandidates[0];
        } else {
          // Tie breaker fallback: pick first top candidate for showcase
          winner = topCandidates[0];
          tieResolved = true;
        }
      }

      groupedResults.push({
        constituency,
        electionType,
        winner,
        isTie,
        tieResolved,
        results: sortedResults,
      });
    });

    return groupedResults;
  }

  // SHA-256 Hashing helper matching block criteria
  private calculateHash(vote: Vote): string {
    const data = `${vote.candidateId}-${vote.constituency}-${new Date(vote.voteDate).getTime()}-${vote.previousHash}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
