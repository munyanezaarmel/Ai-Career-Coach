import {  ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseContentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
export class ChatCourseDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    message: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    courseTitle: string;
}