import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sequence } from './entities/sequence.entity';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private readonly sequenceRepository: Repository<Sequence>,
  ) {}

  async generateId(name: string, prefix: string): Promise<string> {
    const year = new Date().getFullYear();
    const sequenceName = name.toUpperCase();

    let sequence = await this.sequenceRepository.findOne({
      where: { name: sequenceName, year },
    });

    if (!sequence) {
      sequence = this.sequenceRepository.create({
        name: sequenceName,
        prefix,
        year,
        lastSeq: 0,
      });
    }

    sequence.prefix = prefix;
    sequence.lastSeq += 1;
    const savedSequence = await this.sequenceRepository.save(sequence);
    const paddedSeq = savedSequence.lastSeq.toString().padStart(4, '0');
    return `${prefix}${year}${paddedSeq}`;
  }
}
