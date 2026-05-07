import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PollingBoothService } from './polling-booth.service';
import { CreatePollingBoothDto } from './dto/create-polling-booth.dto';
import { UpdatePollingBoothDto } from './dto/update-polling-booth.dto';

@Controller('polling-booth')
export class PollingBoothController {
  constructor(private readonly pollingBoothService: PollingBoothService) {}

  @Post()
  create(@Body() createPollingBoothDto: CreatePollingBoothDto) {
    return this.pollingBoothService.create(createPollingBoothDto);
  }

  @Get()
  findAll() {
    return this.pollingBoothService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollingBoothService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollingBoothDto: UpdatePollingBoothDto) {
    return this.pollingBoothService.update(+id, updatePollingBoothDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollingBoothService.remove(+id);
  }
}
