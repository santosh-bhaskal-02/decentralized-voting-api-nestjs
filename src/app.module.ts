import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VoteModule } from './vote/vote.module';
import { CandidateModule } from './candidate/candidate.module';
import { ConstituencyModule } from './constituency/constituency.module';
import { PartyModule } from './party/party.module';
import { PollingBoothModule } from './polling-booth/polling-booth.module';

// Entities
import { User } from './user/entities/user.entity';
import { VoterRegistration } from './user/entities/voter-registration.entity';
import { DatasetN } from './user/entities/datasetn.entity';
import { Vote } from './vote/entities/vote.entity';
import { Candidate } from './candidate/entities/candidate.entity';
import { Constituency } from './constituency/entities/constituency.entity';
import { Party } from './party/entities/party.entity';
import { PollingBooth } from './polling-booth/entities/polling-booth.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'onlineVotingSysDB',
      entities: [
        User,
        VoterRegistration,
        DatasetN,
        Vote,
        Candidate,
        Constituency,
        Party,
        PollingBooth,
      ],
      synchronize: true, // Only for development/demo; auto-creates tables matching entities
    }),
    AuthModule,
    UserModule,
    VoteModule,
    CandidateModule,
    ConstituencyModule,
    PartyModule,
    PollingBoothModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
