import { Controller, Get, Post, Put, Body, Patch, Param, Delete } from '@nestjs/common';
import { PollingBoothService } from './polling-booth.service';
import { CreatePollingBoothDto } from './dto/create-polling-booth.dto';
import { UpdatePollingBoothDto } from './dto/update-polling-booth.dto';

@Controller('PollingBooth')
export class PollingBoothController {
  constructor(private readonly pollingBoothService: PollingBoothService) {}

  @Post()
  create(@Body() createPollingBoothDto: CreatePollingBoothDto) {
    return this.pollingBoothService.create(createPollingBoothDto);
  }

  @Post('add')
  createWithAdd(@Body() createPollingBoothDto: CreatePollingBoothDto) {
    return this.pollingBoothService.create(createPollingBoothDto);
  }

  @Get()
  findAll() {
    return this.pollingBoothService.findAll();
  }

  @Get('by-constituency/:constituencyId')
  findByConstituency(@Param('constituencyId') constituencyId: string) {
    return this.pollingBoothService.findByConstituency(+constituencyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollingBoothService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollingBoothDto: UpdatePollingBoothDto) {
    return this.pollingBoothService.update(+id, updatePollingBoothDto);
  }

  @Put(':id')
  updateWithPut(@Param('id') id: string, @Body() updatePollingBoothDto: UpdatePollingBoothDto) {
    return this.pollingBoothService.update(+id, updatePollingBoothDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollingBoothService.remove(+id);
  }
}
