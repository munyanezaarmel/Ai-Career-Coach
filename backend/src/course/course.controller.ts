import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ChatCourseDto,
  CreateCourseContentDto,
} from './dto/generateCourse.dto';
import { MediaService } from './media.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@/shared/decorators';

@Controller('course')
@ApiTags('course')
@ApiBearerAuth()
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private mediaService: MediaService,
  ) {}

  @Post('content')
  async createCourseContent(@Body() { title }: CreateCourseContentDto) {
    return this.courseService.generateCourseContent(title);
  }
  @Post('chat')
  async chatCourse(@Body() { courseTitle, message }: ChatCourseDto) {
    return this.courseService.generateAIResponse({ courseTitle, message });
  }
  @Get('recommendations')
  async getRecommendations(@Req() req) {
    return this.courseService.getCareerRecommendations(req.user.id);
  }
  @Post('onboarding')
  async onboarding(@Body() course: object[], @Req() req) {
    return this.courseService.generateCareerRecommendations(
      course,
      req.user.id,
    );
  }
  @Get('interview/question')
  async getInterviewQuestion(@Query() difficulty: string, @Req() req) {
    return this.courseService.generateInterviewQuestion(req.user.id);
  }
  @Post('interview/feedback')
  async provideFeedback(@Body() body: { question: string; answer: string }) {
    try {
      if (!body || !body.question || !body.answer) {
        throw new Error(
          'Invalid request body. Both question and answer are required.',
        );
      }

      const { question, answer } = body;

      const feedback = await this.courseService.generateInterviewFeedback(
        question,
        answer,
      );

      return feedback;
    } catch (error) {
      console.error('Error generating interview feedback:', error);
      throw new Error(
        'Failed to generate interview feedback: ' + error.message,
      );
    }
  }
}
