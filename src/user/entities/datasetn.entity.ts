import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'DatasetN' })
export class DatasetN {
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
}
