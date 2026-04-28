import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  voterId: string;

  @Column({ default: '' })
  fullName: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  mobileNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  dob: Date | null;

  @Column({ nullable: true })
  aadhaarNumber: string;

  @Column({ nullable: true })
  voterCardNumber: string;

  @Column({ default: '' })
  password: string;

  @Column({ nullable: true })
  constituency: string;

  @Column({ nullable: true })
  pollingBooth: string;

  @Column({ default: false })
  hasVoted: boolean;

  @Column({ default: true })
  isApproved: boolean;
}
