import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollingBoothService } from './polling-booth.service';
import { PollingBoothController } from './polling-booth.controller';
import { PollingBooth } from './entities/polling-booth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PollingBooth])],
  controllers: [PollingBoothController],
  providers: [PollingBoothService],
  exports: [PollingBoothService],
})
export class PollingBoothModule {}
