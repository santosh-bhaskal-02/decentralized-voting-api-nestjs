import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstituencyService } from './constituency.service';
import { ConstituencyController } from './constituency.controller';
import { Constituency } from './entities/constituency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Constituency])],
  controllers: [ConstituencyController],
  providers: [ConstituencyService],
  exports: [ConstituencyService],
})
export class ConstituencyModule {}
