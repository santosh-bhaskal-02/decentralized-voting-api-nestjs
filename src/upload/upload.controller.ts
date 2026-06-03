import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ALLOWED_FILE_TYPES, UPLOAD_FOLDER } from 'src/common/constants';
import { AuthGuard } from 'src/common/guards';
import { GetPreSignUrlDto } from './dto/get-pre-sign-url.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('presign-url')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get presigned URL for upload',
    description: 'Returns a presigned URL for uploading a file',
  })
  @ApiQuery({ name: 'folder', enum: Object.values(UPLOAD_FOLDER) })
  @ApiQuery({ name: 'fileType', example: 'image/jpeg', enum: ALLOWED_FILE_TYPES })
  async getPresignedUrl(
    @Query() query: GetPreSignUrlDto,
  ) {
    const { folder, fileType } = query;
    return this.uploadService.getPresignedUrl(folder, fileType);
  }
}
