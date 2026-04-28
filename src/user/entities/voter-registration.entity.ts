import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class VoterRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  fullName: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  mobileNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  dob: Date | null;

  @Column({ default: '' })
  aadhaarNumber: string;

  @Column({ default: '' })
  voterCardNumber: string;

  @Column({ default: '' })
  password: string;

  @Column({ nullable: true })
  constituency: string;

  @Column({ nullable: true })
  pollingBooth: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  isRejected: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registeredAt: Date;
}
