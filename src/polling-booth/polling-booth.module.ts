import { Module } from '@nestjs/common';
import { PollingBoothService } from './polling-booth.service';
import { PollingBoothController } from './polling-booth.controller';

@Module({
  controllers: [PollingBoothController],
  providers: [PollingBoothService],
})
export class PollingBoothModule {}
