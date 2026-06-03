import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Party } from './entities/party.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class PartyService {
  constructor(
    @InjectRepository(Party)
    private readonly partyRepository: Repository<Party>,
    private readonly uploadService: UploadService,
  ) {}

  async create(createPartyDto: CreatePartyDto): Promise<Party> {
    const party = this.partyRepository.create(createPartyDto);
    return this.partyRepository.save(party);
  }

  async findAll(): Promise<Party[]> {
    const parties = await this.partyRepository.find();
    await Promise.all(
      parties.map(async (party) => {
        party.logoUrl = await this.uploadService.getReadPresignedUrl(party.logoUrl);
      }),
    );
    return parties;
  }

  async findOne(id: number): Promise<Party> {
    const party = await this.partyRepository.findOne({ where: { id } });
    if (!party) throw new NotFoundException(`Party #${id} not found`);
    party.logoUrl = await this.uploadService.getReadPresignedUrl(party.logoUrl);
    return party;
  }

  async update(id: number, updatePartyDto: UpdatePartyDto): Promise<Party> {
    const party = await this.findOne(id);
    Object.assign(party, updatePartyDto);
    return this.partyRepository.save(party);
  }

  async remove(id: number): Promise<{ message: string }> {
    const party = await this.findOne(id);
    await this.partyRepository.remove(party);
    return { message: `Party #${id} deleted successfully` };
  }
}
