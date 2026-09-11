import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly cloudfrontUrl: string;

  constructor(configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('AWS_ACCESS_KEY'),
        secretAccessKey: configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = configService.getOrThrow<string>('AWS_BUCKET_NAME');
    this.cloudfrontUrl = configService.getOrThrow<string>('CLOUDFRONT_URL');
  }

  async uploadFile(
    buffer: Buffer,
    key: string,
    mimetype: string,
  ): Promise<{ key: string; url: string }> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      }),
    );
    return { key, url: `https://${this.cloudfrontUrl}/${key}` };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
    );
  }
}
