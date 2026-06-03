import {
  Injectable,
  InternalServerErrorException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import * as config from '@nestjs/config';
import awsConfig from '../config/aws.config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import {
  ALLOWED_FILE_TYPES,
  UPLOAD_FOLDER,
  PRESIGN_EXPIRY_SECONDS,
} from 'src/common/constants';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsConf: config.ConfigType<typeof awsConfig>,
  ) {
    this.bucketName = this.awsConf.s3Bucket!;
    this.region = this.awsConf.region!;
    const accessKeyId = this.awsConf.accessKeyId!;
    const secretAccessKey = this.awsConf.secretAccessKey!;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getPresignedUrl(folder: string, fileType: string) {
    try {
      if (!Object.values(UPLOAD_FOLDER).includes(folder as any)) {
        throw new BadRequestException(
          `Invalid folder. Allowed folders: ${Object.values(UPLOAD_FOLDER).join(', ')}`,
        );
      }

      if (!ALLOWED_FILE_TYPES.includes(fileType)) {
        throw new BadRequestException(
          `Invalid fileType. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
        );
      }

      const extension = fileType.split('/')[1]?.split(';')[0] || 'bin';
      const uniqueKey = `${folder}/${uuidv4()}-${Date.now()}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueKey,
        ContentType: fileType,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: PRESIGN_EXPIRY_SECONDS,
      });

      return {
        url,
        key: uniqueKey,
        publicUrl: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${uniqueKey}`,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Upload service currently unavailable',
      );
    }
  }

  async getReadPresignedUrl(
    key: string,
    expiryInSeconds: number = PRESIGN_EXPIRY_SECONDS,
  ) {
    try {
      if (!key) {
        return '';
      }
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiryInSeconds,
      });
      return url;
    } catch (error) {
      throw new InternalServerErrorException(
        'Upload service currently unavailable',
      );
    }
  }
}
