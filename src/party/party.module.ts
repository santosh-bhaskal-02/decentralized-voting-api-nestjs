import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyService } from './party.service';
import { PartyController } from './party.controller';
import { Party } from './entities/party.entity';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Party]), AuthModule, UploadModule],
  controllers: [PartyController],
  providers: [PartyService],
  exports: [PartyService],
})
export class PartyModule {}
