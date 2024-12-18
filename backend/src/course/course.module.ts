import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MediaService } from './media.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, MediaService]
})
export class CourseModule {}
