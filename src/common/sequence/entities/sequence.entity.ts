import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['name', 'year'], { unique: true })
export class Sequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  prefix: string;

  @Column()
  year: number;

  @Column({ default: 0 })
  lastSeq: number;
}
