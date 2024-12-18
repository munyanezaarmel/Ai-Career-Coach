import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { configValidationSchema } from './shared/config';
import { CareerModule } from './career/career.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CourseModule } from './course/course.module';
import { MediaService } from './course/media.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 30,
      },
    ]),
    CareerModule,
    AuthModule,
    UserModule,
    CourseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    MediaService,
  ],
})
export class AppModule {}
