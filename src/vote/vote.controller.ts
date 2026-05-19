import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { VoteService } from './vote.service';

@Controller('Vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get('candidates')
  async getCandidates(
    @Query('voterCardNumber') voterCardNumber?: string,
    @Query('electionType') electionType?: string,
  ) {
    return await this.voteService.getCandidates(voterCardNumber, electionType);
  }

  @Post('cast-vote')
  async castVote(
    @Body() body: { voterCardNumber: string; candidateId: number },
  ) {
    return await this.voteService.castVote(body.voterCardNumber, body.candidateId);
  }

  @Get('verify-blockchain')
  async verifyBlockchain() {
    return await this.voteService.verifyBlockchain();
  }

  @Get('audit-trail')
  async getAuditTrail() {
    return await this.voteService.getAuditTrail();
  }

  @Get('results')
  async getResults() {
    return await this.voteService.getResults();
  }
}
