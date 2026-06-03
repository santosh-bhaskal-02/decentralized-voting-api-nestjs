import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../constants';

export class ApiPaginationDto {
  @ApiProperty({ example: 1, required: false, default: DEFAULT_PAGE })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiProperty({ example: 10, required: false, default: DEFAULT_LIMIT })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  limit?: number = DEFAULT_LIMIT;
}
