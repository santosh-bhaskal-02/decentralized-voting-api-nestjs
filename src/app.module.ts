import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { UploadModule } from './upload/upload.module';

// Entities
import { User } from './user/entities/user.entity';
import { VoterRegistration } from './user/entities/voter-registration.entity';
import { DatasetN } from './user/entities/datasetn.entity';
import { Vote } from './vote/entities/vote.entity';
import { Candidate } from './candidate/entities/candidate.entity';
import { Constituency } from './constituency/entities/constituency.entity';
import { Party } from './party/entities/party.entity';
import { PollingBooth } from './polling-booth/entities/polling-booth.entity';
import { Sequence } from './common/sequence/entities/sequence.entity';
import { appConfig, awsConfig, databaseConfig, validate } from './config/index.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, awsConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          User,
          VoterRegistration,
          DatasetN,
          Vote,
          Candidate,
          Constituency,
          Party,
          PollingBooth,
          Sequence,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    VoteModule,
    CandidateModule,
    ConstituencyModule,
    PartyModule,
    PollingBoothModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
