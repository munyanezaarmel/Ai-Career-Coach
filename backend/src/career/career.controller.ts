import {
  Controller,
  Post,
  Req,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CareerService } from './career.service';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PreferencesDTO } from './career.dto';
import { Express } from 'express';
import { Public } from '@/shared/decorators';
import * as fs from 'fs';
import * as path from 'path';

@Controller('career')
@ApiTags('career')
@ApiBearerAuth()
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post('generate')
  async generateCareerPath(@Req() req) {
    return this.careerService.generateCareerPath(req.user?.id);
  }

  @Post('add-preferneces')
  async addPreferences(@Body() { questions }: PreferencesDTO, @Req() req) {
    return this.careerService.savePreferences({
      questions,
      userId: req.user?.id,
    });
  }

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Public()
  async transcribeAudio(
    @UploadedFile() audio: Express.Multer.File,
    @Req() req,
  ) {
    if (!audio) {
      throw new BadRequestException('No audio file uploaded');
    }
    console.log('Received audio file:', audio.originalname);

    // Save the audio file to local storage
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${audio.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, audio.buffer);
    console.log('Audio file saved to:', filePath);
    return this.careerService.transcribeAudio(filePath);
  }
}
