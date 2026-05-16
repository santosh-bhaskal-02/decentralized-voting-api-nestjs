import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  candidateId: number;

  @Column({ nullable: true })
  constituency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  voteDate: Date;

  @Column({ default: '' })
  hash: string;

  @Column({ default: '' })
  previousHash: string;
}
