import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PreferencesDTO {
  @ApiProperty()
  @IsArray()
  questions: { question: string; answer: string }[];
}
