import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private r2: S3Client;
  private wojaks: ListObjectsCommandOutput['Contents'] = [];

  async onModuleInit() {
    await this.initR2Client();
  }

  private async initR2Client() {
    this.r2 = new S3Client({
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET,
      },
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
    });

    this.logger.log('✅ Initialized Cloudflare R2 Client');

    await this.loadWojaks();
  }

  async listObjects() {
    return await this.r2.send(
      new ListObjectsCommand({
        Bucket: process.env.R2_BUCKET,
      }),
    );
  }

  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    return await this.r2.send(command);
  }

  async loadWojaks() {
    try {
      this.wojaks = (await this.listObjects()).Contents;
      this.logger.log(`🚀 Loaded ${this.wojaks.length} wojaks`);
    } catch (e) {
      this.logger.error(`❌ Failed to load wojaks: ${e}`);
    }
  }

  async getRandomWojak() {
    if (!this.wojaks?.length) await this.loadWojaks();
    return this.wojaks[Math.floor(Math.random() * this.wojaks.length)];
  }

  generateAHHHHHHH() {
    const chars = ['A', 'R', 'G', 'H'];
    const len = Math.floor(Math.random() * 25);
    let str = 'A';
    for (let i = 0; i < 15 + len; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    str += 'HH!';
    return str;
  }
}
