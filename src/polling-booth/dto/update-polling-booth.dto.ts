import { PartialType } from '@nestjs/swagger';
import { CreatePollingBoothDto } from './create-polling-booth.dto';

export class UpdatePollingBoothDto extends PartialType(CreatePollingBoothDto) {}
