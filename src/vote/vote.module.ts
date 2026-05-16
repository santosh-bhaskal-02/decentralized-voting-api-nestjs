import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { VoteGateway } from './vote.gateway';
import { Vote } from './entities/vote.entity';
import { Candidate } from '../candidate/entities/candidate.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Candidate, User])],
  controllers: [VoteController],
  providers: [VoteService, VoteGateway],
  exports: [VoteService],
})
export class VoteModule {}
