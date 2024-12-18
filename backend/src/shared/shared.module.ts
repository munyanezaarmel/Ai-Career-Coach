import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from './services/prisma.service';
import { EmailService } from './services/email.service';
import { FileService } from './services/file.service';
import { GroqService } from './services/groq.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    ConfigService,
    EmailService,
    GroqService,
    FileService,
    JwtService,
  ],
  exports: [
    PrismaService,
    ConfigService,
    EmailService,
    GroqService,
    FileService,
    JwtService,
  ],
})
export class SharedModule {}
