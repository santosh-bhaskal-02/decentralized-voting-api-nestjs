import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constituency } from './entities/constituency.entity';
import { CreateConstituencyDto } from './dto/create-constituency.dto';
import { UpdateConstituencyDto } from './dto/update-constituency.dto';

@Injectable()
export class ConstituencyService {
  constructor(
    @InjectRepository(Constituency)
    private readonly constituencyRepository: Repository<Constituency>,
  ) {}

  async create(createConstituencyDto: CreateConstituencyDto): Promise<Constituency> {
    const constituency = this.constituencyRepository.create(createConstituencyDto);
    return await this.constituencyRepository.save(constituency);
  }

  async findAll(): Promise<Constituency[]> {
    return await this.constituencyRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Constituency> {
    const constituency = await this.constituencyRepository.findOne({ where: { id } });
    if (!constituency) {
      throw new NotFoundException(`Constituency with ID #${id} not found`);
    }
    return constituency;
  }

  async update(id: number, updateConstituencyDto: UpdateConstituencyDto): Promise<Constituency> {
    const constituency = await this.findOne(id);
    Object.assign(constituency, updateConstituencyDto);
    return await this.constituencyRepository.save(constituency);
  }

  async remove(id: number): Promise<{ message: string }> {
    const constituency = await this.findOne(id);
    await this.constituencyRepository.remove(constituency);
    return { message: `Constituency #${id} deleted successfully` };
  }
}
