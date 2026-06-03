import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UPLOAD_FOLDER } from 'src/common/constants';

export class GetPreSignUrlDto {
  @ApiProperty({ enum: UPLOAD_FOLDER })
  @IsString()
  @IsNotEmpty()
  folder: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  fileType: string;
}
