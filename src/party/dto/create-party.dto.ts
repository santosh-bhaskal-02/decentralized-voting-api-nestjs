import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePartyDto {
  @ApiProperty({ example: 'National Democratic Party' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://bucket.s3.region.amazonaws.com/PARTY_SYMBOL/uuid.png' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  logoUrl: string;
}
