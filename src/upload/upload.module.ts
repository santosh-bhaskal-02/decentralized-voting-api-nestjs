import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';
import awsConfig from 'src/config/aws.config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule.forFeature(awsConfig), AuthModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
