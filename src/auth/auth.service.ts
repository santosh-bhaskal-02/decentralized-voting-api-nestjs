import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { DatasetN } from '../user/entities/datasetn.entity';
import { VoterRegistration } from '../user/entities/voter-registration.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenResponse } from '../common/types/auth.types';
import { Role } from '../common/enums/user.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DatasetN)
    private readonly datasetRepository: Repository<DatasetN>,
    @InjectRepository(VoterRegistration)
    private readonly registrationRepository: Repository<VoterRegistration>,
    private readonly jwtService: JwtService,
  ) {}

  async fetchByAadhaar(aadhaarNumber: string) {
    if (!aadhaarNumber?.trim()) {
      throw new BadRequestException('Aadhaar number is required.');
    }

    const cleanedAadhaar = aadhaarNumber.replace(/\s+/g, '').trim();
    const record = await this.datasetRepository.findOne({
      where: { aadhaarNumber: cleanedAadhaar },
    });

    if (!record) {
      throw new NotFoundException('Aadhaar number not found in dataset.');
    }

    return record;
  }

  async register(body: any) {
    const { aadhaarNumber, password, constituency, pollingBooth } = body;
    if (!aadhaarNumber || !password) {
      throw new BadRequestException('Aadhaar number and Password are required.');
    }

    const cleanedAadhaar = aadhaarNumber.replace(/\s+/g, '').trim();
    const datasetRecord = await this.datasetRepository.findOne({
      where: { aadhaarNumber: cleanedAadhaar },
    });

    if (!datasetRecord) {
      throw new BadRequestException('Aadhaar number not found in dataset.');
    }

    const existingVoter = await this.userRepository.findOne({
      where: { aadhaarNumber: cleanedAadhaar },
    });

    if (existingVoter) {
      if (existingVoter.hasVoted) {
        throw new BadRequestException('You are already registered and have already voted.');
      }
      throw new BadRequestException('You are already registered. Please login.');
    }

    const epicNumber = datasetRecord.voterCardNumber || this.generateEpicNumber();

    const existingPending = await this.registrationRepository.findOne({
      where: { aadhaarNumber: cleanedAadhaar },
    });

    if (existingPending) {
      throw new BadRequestException('You already have a pending registration request.');
    }

    const registration = this.registrationRepository.create({
      fullName: datasetRecord.fullName,
      email: datasetRecord.email,
      mobileNumber: datasetRecord.mobileNumber,
      dob: datasetRecord.dob,
      aadhaarNumber: cleanedAadhaar,
      voterCardNumber: epicNumber,
      password,
      constituency,
      pollingBooth,
      isApproved: false,
      isRejected: false,
    });

    const savedReg = await this.registrationRepository.save(registration);

    return {
      message: 'Registration request submitted. Pending admin approval.',
      voterCardNumber: savedReg.voterCardNumber,
    };
  }

  async login(body: any): Promise<TokenResponse> {
    const { voterCardNumber, password } = body;
    if (!voterCardNumber || !password) {
      throw new BadRequestException('Voter Card Number and Password are required.');
    }

    if (voterCardNumber.trim().toLowerCase() === 'admin') {
      if (password === 'admin123') {
        const user = { sub: 'admin', role: Role.ADMIN, identifier: 'admin', email: 'admin@system.com' };
        return {
          message: 'Admin login successful',
          accessToken: await this.jwtService.signAsync(user),
          user,
        };
      } else {
        throw new UnauthorizedException('Incorrect admin password.');
      }
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

    const user = {
      sub: voter.id.toString(),
      role: Role.VOTER,
      identifier: voter.voterCardNumber,
      email: voter.email,
      name: voter.fullName,
    };

    return {
      message: 'Voter login successful',
      accessToken: await this.jwtService.signAsync(user),
      user,
    };
  }

  private generateEpicNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
