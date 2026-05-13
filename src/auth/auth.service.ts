import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { DatasetN } from '../user/entities/datasetn.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DatasetN)
    private readonly datasetRepository: Repository<DatasetN>,
  ) {}

  // Fetch record from national dataset by Aadhaar number
  async fetchByAadhaar(aadhaarNumber: string) {
    if (!aadhaarNumber || aadhaarNumber.trim() === '') {
      throw new BadRequestException('Aadhaar number is required.');
    }

    const cleanedAadhaar = aadhaarNumber.replace(/\s+/g, '').trim();

    const record = await this.datasetRepository.findOne({
      where: { aadhaarNumber: cleanedAadhaar },
    });

    if (!record) {
      throw new NotFoundException('Aadhaar number not found in dataset.');
    }

    return {
      fullName: record.fullName,
      email: record.email,
      mobileNumber: record.mobileNumber,
      dob: record.dob,
      aadhaarNumber: record.aadhaarNumber,
      voterCardNumber: record.voterCardNumber,
    };
  }

  // Register a new voter using Aadhaar details
  async register(body: any) {
    const { aadhaarNumber, password, constituency, pollingBooth } = body;
    
    if (!aadhaarNumber || !password) {
      throw new BadRequestException('Aadhaar number and Password are required.');
    }

    const cleanedAadhaar = aadhaarNumber.replace(/\s+/g, '').trim();

    // Check national database dataset
    const datasetRecord = await this.datasetRepository.findOne({
      where: { aadhaarNumber: cleanedAadhaar },
    });

    if (!datasetRecord) {
      throw new BadRequestException('Aadhaar number not found in dataset.');
    }

    // Check if voter already registered
    const existingVoter = await this.userRepository.findOne({
      where: { aadhaarNumber: cleanedAadhaar },
    });

    if (existingVoter) {
      if (existingVoter.hasVoted) {
        throw new BadRequestException('You are already registered and have already voted.');
      }
      throw new BadRequestException('You are already registered. Please login.');
    }

    // Auto-fill and construct new user
    const voter = new User();
    voter.fullName = datasetRecord.fullName;
    voter.email = datasetRecord.email;
    voter.mobileNumber = datasetRecord.mobileNumber;
    voter.dob = datasetRecord.dob;
    voter.aadhaarNumber = cleanedAadhaar;
    voter.voterCardNumber = datasetRecord.voterCardNumber || this.generateEpicNumber();
    voter.voterId = voter.voterCardNumber;
    voter.password = password;
    voter.constituency = constituency;
    voter.pollingBooth = pollingBooth;
    voter.hasVoted = false;
    voter.isApproved = true;

    await this.userRepository.save(voter);

    console.log(`[EMAIL SEND SIMULATION] Sent voter credentials email to: ${voter.email}`);

    return {
      message: 'Registration successful. Credentials sent to email.',
      voterCardNumber: voter.voterCardNumber,
    };
  }

  // User/Admin Login
  async login(body: any) {
    const { voterCardNumber, password } = body;

    if (!voterCardNumber || !password) {
      throw new BadRequestException('Voter Card Number and Password are required.');
    }

    // Admin login override
    if (voterCardNumber.trim().toLowerCase() === 'admin' && password === 'admin123') {
      return {
        message: 'Admin login successful',
        userId: 'admin',
        name: 'Administrator',
        email: 'admin@system.com',
        role: 'Admin',
        hasVoted: false,
      };
    }

    const voter = await this.userRepository.findOne({
      where: { voterCardNumber: voterCardNumber.trim() },
    });

    if (!voter) {
      throw new UnauthorizedException('Voter Card Number not found.');
    }

    if (voter.password.trim() !== password.trim()) {
      throw new UnauthorizedException('Incorrect password.');
    }

    if (voter.hasVoted) {
      throw new BadRequestException('You have already voted. You cannot login again.');
    }

    return {
      message: 'Voter login successful',
      voterId: voter.id,
      voterCardNumber: voter.voterCardNumber,
      name: voter.fullName,
      email: voter.email,
      constituency: voter.constituency,
      pollingBooth: voter.pollingBooth,
      role: 'Voter',
      hasVoted: voter.hasVoted,
    };
  }

  // Generate 10-char alphanumeric EPIC number
  private generateEpicNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
