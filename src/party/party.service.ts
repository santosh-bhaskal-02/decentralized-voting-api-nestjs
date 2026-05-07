import { Injectable } from '@nestjs/common';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

@Injectable()
export class PartyService {
  create(createPartyDto: CreatePartyDto) {
    return 'This action adds a new party';
  }

  findAll() {
    return `This action returns all party`;
  }

  findOne(id: number) {
    return `This action returns a #${id} party`;
  }

  update(id: number, updatePartyDto: UpdatePartyDto) {
    return `This action updates a #${id} party`;
  }

  remove(id: number) {
    return `This action removes a #${id} party`;
  }
}
