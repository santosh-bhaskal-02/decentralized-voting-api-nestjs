import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollingBooth } from './entities/polling-booth.entity';
import { CreatePollingBoothDto } from './dto/create-polling-booth.dto';
import { UpdatePollingBoothDto } from './dto/update-polling-booth.dto';

@Injectable()
export class PollingBoothService {
  constructor(
    @InjectRepository(PollingBooth)
    private readonly pollingBoothRepository: Repository<PollingBooth>,
  ) {}

  async create(createPollingBoothDto: CreatePollingBoothDto): Promise<PollingBooth> {
    const booth = this.pollingBoothRepository.create(createPollingBoothDto);
    return await this.pollingBoothRepository.save(booth);
  }

  async findAll(): Promise<PollingBooth[]> {
    return await this.pollingBoothRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<PollingBooth> {
    const booth = await this.pollingBoothRepository.findOne({ where: { id } });
    if (!booth) {
      throw new NotFoundException(`Polling booth with ID #${id} not found`);
    }
    return booth;
  }

  async findByConstituency(constituencyId: number): Promise<PollingBooth[]> {
    return await this.pollingBoothRepository.find({
      where: { constituencyId },
      order: { id: 'ASC' },
    });
  }

  async update(id: number, updatePollingBoothDto: UpdatePollingBoothDto): Promise<PollingBooth> {
    const booth = await this.findOne(id);
    Object.assign(booth, updatePollingBoothDto);
    return await this.pollingBoothRepository.save(booth);
  }

  async remove(id: number): Promise<{ message: string }> {
    const booth = await this.findOne(id);
    await this.pollingBoothRepository.remove(booth);
    return { message: `Polling booth #${id} deleted successfully` };
  }
}
