import {
  Controller,
  Get,
  HttpException,
  Res,
  StreamableFile
} from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'node:stream';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getWojak(@Res({ passthrough: true }) res: Response) {
    try {
      const wojak = await this.appService.getRandomWojak();
      const object = await this.appService.getObject(wojak.Key);
      res.set({
        'Content-Type': object.ContentType,
        'Content-Length': object.ContentLength,
        'Content-Disposition': `inline; filename="${this.appService.generateAHHHHHHH()}.${wojak.Key.split('.').pop()}"`,
      });
      return new StreamableFile(object.Body as Readable);
    } catch (e) {
      throw new HttpException(
        `It's Ogre: ${this.appService.generateAHHHHHHH()}`,
        500,
      );
    }
  }
}
