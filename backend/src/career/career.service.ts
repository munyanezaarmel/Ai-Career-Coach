import { BadRequestException, Injectable } from '@nestjs/common';
import { GroqService } from '@/shared/services/groq.service';
import { PrismaService } from '@/shared/services/prisma.service';
import { PreferencesDTO } from './career.dto';

@Injectable()
export class CareerService {
  constructor(
    private readonly groqService: GroqService,
    private prismaService: PrismaService,
  ) {}

  async generateCareerPath(userId: string): Promise<any> {
    const questionsAndAnswers =
      await this.prismaService.userPreferenceQuestion.findMany({
        where: {
          userId,
        },
      });
    const prompt = `Based on the following questions, and answers generate a suitable career path: ${questionsAndAnswers.map(({ answer, question }) => question + ':' + answer)?.join(', ')}`;

    try {
      const result = await this.groqService.sendPrompts({
        messages: [
          {
            role: 'system',
            content:
              'You are json server and Career Advisor return response.  return 10 object in json only in format [{"title":"", "description":"",}], otherwise return empty array',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });

      const response = await JSON.parse(
        result?.choices?.[0]?.message?.content ?? '[]',
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to generate career path');
    }
  }

  async savePreferences({
    questions,
    userId,
  }: PreferencesDTO & { userId: string }): Promise<any> {
    try {
      return await this.prismaService.userPreferenceQuestion.createMany({
        data: questions.map((question) => ({
          userId,
          question: question.question,
          answer: question.answer,
        })),
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to generate career path');
    }
  }

  async transcribeAudio(audioFile: string): Promise<string> {
    try {
      const result = await this.groqService.transcribeAudio(audioFile);
      console.log(result);
      return result.text;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to transcribe audio');
    }
  }

  // async textToAudio(text: string): Promise<Buffer> {
  //   try {
  //     const result = await this.groqService.textToAudio(text);
  //     console.log(result);
  //     return result;
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException('Failed to convert text to audio');
  //   }
  // }
}
