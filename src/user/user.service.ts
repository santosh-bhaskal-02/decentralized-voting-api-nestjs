import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { VoterRegistration } from './entities/voter-registration.entity';
import { DatasetN } from './entities/datasetn.entity';
import { Candidate } from '../candidate/entities/candidate.entity';
import { Vote } from '../vote/entities/vote.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VoterRegistration)
    private readonly registrationRepository: Repository<VoterRegistration>,
    @InjectRepository(DatasetN)
    private readonly datasetNRepository: Repository<DatasetN>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  // Add voter directly by Admin
  async addVoter(body: any) {
    const { name, email } = body;
    if (!name || !email) {
      throw new BadRequestException('Name and Email are required');
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const password = this.generatePassword();
    const voter = new User();
    voter.fullName = name.trim();
    voter.email = email.trim();
    voter.voterId = ''; // temporary
    voter.password = password;
    voter.hasVoted = false;
    voter.isApproved = true;

    await this.userRepository.save(voter);

    // Generate and Sync EPIC details
    voter.voterId = this.generateEpicNumber();
    voter.voterCardNumber = voter.voterId;
    await this.userRepository.save(voter);

    console.log(
      `[EMAIL SEND SIMULATION] Sent admin-created voter credentials to: ${voter.email}`,
    );

    return {
      message: 'Voter added successfully',
      voterId: voter.voterId,
      password: password,
    };
  }

  // Get all registered voters list
  async findAllVoters() {
    return await this.userRepository.find({ order: { id: 'DESC' } });
  }

  // Delete a voter
  async deleteVoter(id: number) {
    const voter = await this.userRepository.findOne({ where: { id } });
    if (!voter) {
      throw new NotFoundException('Voter not found');
    }
    await this.userRepository.remove(voter);
    return { message: 'Voter deleted successfully' };
  }

  // Get pending registrations requiring Admin approval
  async getPendingRegistrations() {
    return await this.registrationRepository.find({
      where: { isApproved: false, isRejected: false },
      order: { registeredAt: 'DESC' },
    });
  }

  // Approve voter registration request
  async approveVoter(id: number) {
    const reg = await this.registrationRepository.findOne({ where: { id } });
    if (!reg) {
      throw new NotFoundException('Registration not found');
    }

    // Verify user doesn't already exist
    const existing = await this.userRepository.findOne({
      where: [{ aadhaarNumber: reg.aadhaarNumber }, { email: reg.email }],
    });

    if (existing) {
      await this.registrationRepository.remove(reg);
      throw new BadRequestException('Voter already exists in the system');
    }

    const voter = new User();
    voter.fullName = reg.fullName;
    voter.email = reg.email;
    voter.mobileNumber = reg.mobileNumber;
    voter.dob = reg.dob;
    voter.aadhaarNumber = reg.aadhaarNumber;
    voter.voterCardNumber = reg.voterCardNumber || this.generateEpicNumber();
    voter.voterId = voter.voterCardNumber;
    voter.password = reg.password;
    voter.constituency = reg.constituency;
    voter.pollingBooth = reg.pollingBooth;
    voter.hasVoted = false;
    voter.isApproved = true;

    await this.userRepository.save(voter);
    await this.registrationRepository.remove(reg);

    console.log(
      `[EMAIL SEND SIMULATION] Sent approved registration email to: ${voter.email}`,
    );

    return { message: 'Voter approved and credentials sent via email' };
  }

  // Reject registration request
  async rejectVoter(id: number) {
    const reg = await this.registrationRepository.findOne({ where: { id } });
    if (!reg) {
      throw new NotFoundException('Registration not found');
    }
    await this.registrationRepository.remove(reg);
    return { message: 'Voter registration rejected' };
  }

  // --- DatasetN (Pre-verified Voter Dataset) Operations ---

  // Add single pre-verified voter to DatasetN
  async addDatasetVoter(body: any) {
    const {
      fullName,
      email,
      mobileNumber,
      dob,
      aadhaarNumber,
      voterCardNumber,
    } = body;
    if (!fullName || !aadhaarNumber || !voterCardNumber) {
      throw new BadRequestException(
        'Full Name, Aadhaar Number, and Voter Card Number are required',
      );
    }

    const existing = await this.datasetNRepository.findOne({
      where: [
        { aadhaarNumber: aadhaarNumber.trim() },
        { voterCardNumber: voterCardNumber.trim() },
      ],
    });

    if (existing) {
      throw new BadRequestException(
        'A voter with this Aadhaar or Voter Card Number already exists in the pre-verified dataset',
      );
    }

    const datasetVoter = new DatasetN();
    datasetVoter.fullName = fullName.trim();
    datasetVoter.email = email?.trim() || '';
    datasetVoter.mobileNumber = mobileNumber?.trim() || '';
    datasetVoter.dob = dob ? new Date(dob) : null;
    datasetVoter.aadhaarNumber = aadhaarNumber.trim();
    datasetVoter.voterCardNumber = voterCardNumber.trim();

    await this.datasetNRepository.save(datasetVoter);
    return {
      message: 'Pre-verified voter added to dataset successfully',
      data: datasetVoter,
    };
  }

  // Get all DatasetN records
  async findAllDatasetVoters() {
    return await this.datasetNRepository.find({ order: { id: 'DESC' } });
  }

  // Bulk import multiple DatasetN records
  async importDataset(records: any[]) {
    if (!Array.isArray(records)) {
      throw new BadRequestException('Records must be an array');
    }

    const savedRecords: DatasetN[] = [];
    for (const record of records) {
      const {
        fullName,
        email,
        mobileNumber,
        dob,
        aadhaarNumber,
        voterCardNumber,
      } = record;
      if (!fullName || !aadhaarNumber || !voterCardNumber) {
        continue; // Skip invalid records
      }

      // Check duplicates
      const existing = await this.datasetNRepository.findOne({
        where: [
          { aadhaarNumber: aadhaarNumber.trim() },
          { voterCardNumber: voterCardNumber.trim() },
        ],
      });

      if (existing) {
        continue; // Skip duplicates
      }

      const datasetVoter = new DatasetN();
      datasetVoter.fullName = fullName.trim();
      datasetVoter.email = email?.trim() || '';
      datasetVoter.mobileNumber = mobileNumber?.trim() || '';
      datasetVoter.dob = dob ? new Date(dob) : null;
      datasetVoter.aadhaarNumber = aadhaarNumber.trim();
      datasetVoter.voterCardNumber = voterCardNumber.trim();

      savedRecords.push(datasetVoter);
    }

    if (savedRecords.length > 0) {
      await this.datasetNRepository.save(savedRecords);
    }

    return {
      message: `Successfully imported ${savedRecords.length} records into the pre-verified dataset.`,
      count: savedRecords.length,
    };
  }

  // --- Candidate Operations (Admin) ---

  async addCandidate(body: any) {
    const { name, party, position, constituency, logoUrl, electionType } = body;
    if (!name || !party) {
      throw new BadRequestException(
        'Candidate name and party name are required',
      );
    }

    const candidate = new Candidate();
    candidate.name = name.trim();
    candidate.party = party.trim();
    candidate.position = position?.trim() || '';
    candidate.constituency = constituency?.trim() || null;
    candidate.logoUrl = logoUrl?.trim() || null;
    candidate.electionType = electionType?.trim() || 'StateAssembly';

    await this.candidateRepository.save(candidate);
    return { message: 'Candidate added successfully' };
  }

  async updateCandidate(id: number, body: any) {
    const { name, party, position, constituency, logoUrl, electionType } = body;
    if (!name || !party) {
      throw new BadRequestException(
        'Candidate name and party name are required',
      );
    }

    const candidate = await this.candidateRepository.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    candidate.name = name.trim();
    candidate.party = party.trim();
    candidate.position = position?.trim() || '';
    candidate.constituency = constituency?.trim() || null;
    candidate.electionType = electionType?.trim() || 'StateAssembly';

    if (logoUrl !== undefined) {
      candidate.logoUrl = logoUrl?.trim() || null;
    }

    await this.candidateRepository.save(candidate);
    return { message: 'Candidate updated successfully' };
  }

  async findAllCandidates() {
    return await this.candidateRepository.find();
  }

  async deleteCandidate(id: number) {
    const candidate = await this.candidateRepository.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }
    await this.candidateRepository.remove(candidate);
    return { message: 'Candidate deleted successfully' };
  }

  async getDashboardStats() {
    const totalVoters = await this.userRepository.count();
    const pendingVoters = await this.registrationRepository.count({
      where: { isApproved: false, isRejected: false },
    });
    const totalCandidates = await this.candidateRepository.count();
    const totalVotes = await this.voteRepository.count();

    const candidates = await this.candidateRepository.find();
    const votes = await this.voteRepository.find();

    const topCandidates = candidates
      .map((c) => {
        const count = votes.filter((v) => v.candidateId === c.id).length;
        return {
          candidateId: c.id,
          candidateName: c.name,
          party: c.party,
          voteCount: count,
        };
      })
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 5);

    return {
      totalVoters,
      pendingVoters,
      totalCandidates,
      totalVotes,
      topCandidates,
    };
  }

  async resetAllVoters() {
    await this.userRepository.update({}, { hasVoted: false });
    await this.voteRepository.clear();
    return { message: 'All voter statuses and votes have been reset for the new election.' };
  }

  // Helpers
  private generatePassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateEpicNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
