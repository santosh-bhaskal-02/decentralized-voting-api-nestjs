import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { VoterRegistration as VoterReg } from './entities/voter-registration.entity';
import { DatasetN } from './entities/datasetn.entity';
import { Candidate } from '../candidate/entities/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, VoterReg, DatasetN, Candidate])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
