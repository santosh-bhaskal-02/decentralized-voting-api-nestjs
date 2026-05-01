import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('Admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add-voter')
  async addVoter(@Body() body: any) {
    return await this.userService.addVoter(body);
  }

  @Get('voters')
  async getVoters() {
    return await this.userService.findAllVoters();
  }

  @Get('all-voters')
  async getAllVoters() {
    return await this.userService.findAllVoters();
  }

  @Delete('delete-voter/:id')
  async deleteVoter(@Param('id') id: string) {
    return await this.userService.deleteVoter(+id);
  }

  @Get('pending-registrations')
  async getPendingRegistrations() {
    return await this.userService.getPendingRegistrations();
  }

  @Post('approve-voter/:id')
  async approveVoter(@Param('id') id: string) {
    return await this.userService.approveVoter(+id);
  }

  @Post('reject-voter/:id')
  async rejectVoter(@Param('id') id: string) {
    return await this.userService.rejectVoter(+id);
  }

  @Post('add-dataset-voter')
  async addDatasetVoter(@Body() body: any) {
    return await this.userService.addDatasetVoter(body);
  }

  @Get('dataset-voters')
  async getDatasetVoters() {
    return await this.userService.findAllDatasetVoters();
  }

  @Post('import-dataset')
  async importDataset(@Body() records: any[]) {
    return await this.userService.importDataset(records);
  }

  // --- Candidates Management ---
  @Post('add-candidate')
  async addCandidate(@Body() body: any) {
    return await this.userService.addCandidate(body);
  }

  @Put('update-candidate/:id')
  async updateCandidate(@Param('id') id: string, @Body() body: any) {
    return await this.userService.updateCandidate(+id, body);
  }

  @Get('candidates')
  async getCandidates() {
    return await this.userService.findAllCandidates();
  }

  @Delete('delete-candidate/:id')
  async deleteCandidate(@Param('id') id: string) {
    return await this.userService.deleteCandidate(+id);
  }
}
