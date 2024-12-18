import { GroqService } from '@/shared/services/groq.service';
import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
  constructor(
    private readonly groqService: GroqService,
    private prismaService: PrismaService,
  ) {}

  async generateInterviewFeedback(question = 'None', answer = 'None') {
    if (question === 'None' || answer === 'None') {
      return {
        overallAssessment: 'No feedback provided',
        confidenceScore: 0,
        suggestions: [],
        keyStrengths: [],
        areasForImprovement: [],
      };
    }
    try {
      const prompt = `You are an expert in providing feedback for job interviews. Provide feedback for the following question and answer:
      Question: ${question}
      Answer: ${answer}`;
      const response = await this.groqService.sendPrompts({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: 'You are hiring expert,' },
          {
            role: 'system',
            content: `You are a JSON API that provides feedback for job interviews. Always return a valid JSON object with the following format:
{
  "overallAssessment": "string",
  "confidenceScore": number,
  "suggestions": ["string", "string", "string"],
  "keyStrengths": ["string", "string"],
  "areasForImprovement": ["string", "string"]
}
Rules:
1. confidenceScore, is confidence that user can be hired, must be a float between 0 and 100.
2. All fields must be present.
3. If there are no suggestions, keyStrengths, or areasForImprovement, use empty arrays [].
4. Ensure the response is always a valid JSON object.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error(
        'Error calling Groq API:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to generate interview feedback');
    }
  }

  async generateAIResponse(data: {
    message: string;
    courseTitle: string;
  }): Promise<string> {
    const prompt = `As an advanced AI expert specializing in "${data.courseTitle}", provide a comprehensive yet concise response to the following query: "${data.message}"

Your response should:
1. Demonstrate deep subject matter expertise
2. Use clear, accessible language suitable for learners
3. Incorporate relevant examples or analogies when appropriate
4. Address any underlying concepts or principles related to the query
5. Suggest additional areas of exploration if applicable
6. The answer should be very short

Respond in plain text, optimized for readability and understanding. `;

    const response = await this.groqService.sendPrompts({
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  }

  async generateCourseContent(
    courseTitle: string,
    userId?: string,
  ): Promise<any> {
    try {
      // First loop: Get course outline
      const outlinePrompt = `As a JSON API, generate a comprehensive course outline for "${courseTitle}". Return a valid JSON array with exactly 5 main topics in the following format:
[
  {
    "title": "Main Topic Title",
    "description": "A concise 2-3 sentence summary of the topic"
  }
]
Ensure each topic is distinct, covers a key aspect of the course, and follows a logical progression. The descriptions should be informative yet brief, giving a clear overview of what will be covered in each section.`;
      const sections = await this.prismaService.courseSection.findMany({
        where: {
          courseTitle,
        },
      });
      if (sections.length > 0) {
        return sections.map((section) => ({
          title: section.sectionTitle,
          description: section.sectionContent,
          content: section.sectionContent,
        }));
      }
      const outlineResponse = await this.groqService.sendPrompts({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: outlinePrompt }],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const outline = JSON.parse(outlineResponse.choices[0].message.content);

      // Second loop: Get detailed content for each outline item
      const detailedCourse = await Promise.all(
        outline.map(async (item) => {
          const contentPrompt = `As an expert educator, provide comprehensive content for the course topic "${item.title}". Your response should:
1. Be in Markdown format
2. Be equivalent to at least one full page of text (approximately 500 words)
3. Include a brief introduction to the topic
4. Cover key concepts and theories related to the topic
5. Provide at least 2 practical examples or case studies
6. Include code snippets or technical details if relevant
7. End with a summary and 2-3 discussion questions
Ensure the content is engaging, well-structured, and suitable for an online learning environment.`;

          const section = await this.prismaService.courseSection.findFirst({
            where: {
              courseTitle: courseTitle,
              sectionTitle: item.title,
            },
          });
          if (section) {
            return {
              title: section.sectionTitle,
              description: section.sectionContent,
              content: section.sectionContent,
            };
          }

          const contentResponse = await this.groqService.sendPrompts({
            model: 'mixtral-8x7b-32768',
            messages: [{ role: 'user', content: contentPrompt }],
            temperature: 0.7,
            max_tokens: 2048,
          });

          await this.prismaService.courseSection.create({
            data: {
              courseTitle: courseTitle,
              sectionTitle: item.title,
              userId,
              sectionContent: contentResponse.choices[0].message.content,
            },
          });

          return {
            title: item.title,
            description: item.description,
            content: contentResponse.choices[0].message.content,
          };
        }),
      );

      return detailedCourse;
    } catch (error) {
      console.error('Error in generateCourseContent:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  processContentIntoSteps(content) {
    // Split the content into lines
    const lines = content.split('\n').filter((line) => line.trim() !== '');

    const steps = [];
    let currentStep = null;

    for (const line of lines) {
      if (line.startsWith('Step ') || line.startsWith('Introduction')) {
        if (currentStep) {
          steps.push(currentStep);
        }
        currentStep = { label: line.trim(), description: '' };
      } else if (currentStep) {
        currentStep.description += line.trim() + ' ';
      }
    }
  }

  async generateCareerRecommendations(answers: object, userId: string) {
    try {
      const recomendations =
        (await this.prismaService.careerRecomendation.findMany({})) ?? [];
      if (recomendations?.length > 0) {
        await this.prismaService.careerRecomendation.deleteMany({});
      }
      const prompt = `Based on the following user responses, generate personalized career recommendations and skill-building exercises:
  ${JSON.stringify(answers, null, 2)}
  Provide a list of 10 recommended skill cards, each containing a title, description, and button text. Return the result as a JSON array.`;

      const response = await this.groqService.sendPrompts({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const questions = Object.keys(answers);
      const answersArray = Object.values(answers);
      await this.prismaService.userPreferenceQuestion.createMany({
        data: questions.map((question, index) => ({
          userId,
          question,
          answer: answersArray[index],
        })),
      });

      if (
        response &&
        response.choices &&
        response.choices[0] &&
        response.choices[0].message
      ) {
        const content = response.choices[0].message.content;
        console.log('API response content:', content);

        let parsedContent;
        try {
          parsedContent = JSON.parse(content);
          console.log(parsedContent);
        } catch (parseError) {
          console.error('Error parsing API response as JSON:', parseError);
          // If parsing fails, treat the content as a string and wrap it in an array
          parsedContent = [
            {
              title: 'General Recommendation',
              description: content,
              buttonText: 'Learn More',
            },
          ];
        }

        parsedContent = Array.isArray(parsedContent)
          ? parsedContent
          : [parsedContent];
        await this.prismaService.careerRecomendation.createMany({
          data: parsedContent.map((skill) => ({
            userId,
            title: skill.title,
            description: skill.description,
            buttonText: skill.buttonText,
          })),
        });
        return parsedContent;
      } else {
        console.error('Unexpected API response structure:', response);
        return [];
      }
    } catch (error) {
      console.error(
        'Error in generateCareerRecommendations:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
  async getCareerRecommendations(userId: string) {
    console.log(userId);
    const recommendations =
      await this.prismaService.careerRecomendation.findMany({
        where: {
          userId,
        },
      });
    return recommendations;
  }
  async generateInterviewQuestion(userId: string) {
    const questions = await this.prismaService.userPreferenceQuestion.findMany({
      where: {
        userId,
      },
    });
    const prompt = `Based on the user's preferences  questions:
     ${questions
       .map(
         (question) =>
           'Question:' + question.question + ' Answer:' + question.answer,
       )
       .join('\n')} create 4 interview questions`;
    console.log(prompt);

    try {
      const response = await this.groqService.sendPrompts({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are a JSON API that returns valid JSON only. Generate a list of at least 3 interview questions based on the user's preferences. The response must strictly adhere to the following format and rules:

[
  {
    "text": "What is your experience with [relevant technology]?",
    "difficulty": "easy|medium|hard"
  },
  {
    "text": "Can you describe a challenging project you've worked on using [relevant skill]?",
    "difficulty": "easy|medium|hard"
  },
  ...
]

Rules:
1. The response must be a valid JSON array.
2. Each question object must have exactly two properties: "text" and "difficulty".
3. The "text" property must be a string containing the interview question.
4. The "difficulty" property must be one of these exact strings: "easy", "medium", or "hard".
5. Generate at least 3 questions, but no more than 5.
6. Ensure questions are relevant to the user's background and preferences.
7. Vary the difficulty levels across the questions.
8. Do not include any additional properties or explanations outside the JSON structure.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      console.log('AI response:', content);
      return JSON.parse(content);
    } catch (error) {
      console.error(
        'Error calling Groq API:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to generate interview questions');
    }
  }
}
