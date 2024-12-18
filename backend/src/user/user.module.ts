import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/shared/services/prisma.service';
import { EmailService } from '@/shared/services/email.service';
import { FileService } from '@/shared/services/file.service';

@Module({
  providers: [UserService, PrismaService,EmailService, FileService ],
  controllers: [UserController],
  exports:[
    UserService,
  ]
})
export class UserModule {}
