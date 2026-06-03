import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PollingBooth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  constituencyId: number;

  @Column({ nullable: true })
  boothNumber: string;

  @Column({ nullable: true })
  constituency: string;
}