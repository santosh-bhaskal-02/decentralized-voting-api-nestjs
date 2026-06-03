import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('fetch-by-aadhaar/:aadhaarNumber')
  async fetchByAadhaar(@Param('aadhaarNumber') aadhaarNumber: string) {
    return await this.authService.fetchByAadhaar(aadhaarNumber);
  }

  @Post('register')
  async register(@Body() body: any) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return await this.authService.login(body);
  }
}
