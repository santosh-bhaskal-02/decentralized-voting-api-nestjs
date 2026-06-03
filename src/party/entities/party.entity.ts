import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Party {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  logoUrl: string;
}
