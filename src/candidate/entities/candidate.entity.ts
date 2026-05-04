import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  party: string;

  @Column({ default: '' })
  position: string;

  @Column({ nullable: true })
  constituency: string;

  @Column({ nullable: true })
  symbolUrl: string;

  @Column({ default: 'StateAssembly' })
  electionType: string;

  @Column({ default: 0 })
  voteCount: number;
}
