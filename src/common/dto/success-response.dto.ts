import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
