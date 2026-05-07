import { Injectable } from '@nestjs/common';
import { CreatePollingBoothDto } from './dto/create-polling-booth.dto';
import { UpdatePollingBoothDto } from './dto/update-polling-booth.dto';

@Injectable()
export class PollingBoothService {
  create(createPollingBoothDto: CreatePollingBoothDto) {
    return 'This action adds a new pollingBooth';
  }

  findAll() {
    return `This action returns all pollingBooth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pollingBooth`;
  }

  update(id: number, updatePollingBoothDto: UpdatePollingBoothDto) {
    return `This action updates a #${id} pollingBooth`;
  }

  remove(id: number) {
    return `This action removes a #${id} pollingBooth`;
  }
}
