import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { Candidate } from './entities/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService, TypeOrmModule],
})
export class CandidateModule {}
