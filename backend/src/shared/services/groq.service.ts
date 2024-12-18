import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import Groq from 'groq-sdk';
import { APIPromise } from 'groq-sdk/core';
interface GroqAPIOptions {
  messages: {
    role: 'user' | 'system';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string;
  stream?: false;
  model?: string;
  voice?: string;
  audio?: Buffer;
}
@Injectable()
export class GroqService {
  private apiUrl: string;
  private _groq: Groq;

  constructor(private configService: ConfigService) {
    this._groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async sendPrompts({
    model = 'llama-3.2-90b-text-preview',
    ...groqOptions
  }: GroqAPIOptions): Promise<{ choices: { message: { content: string } }[] }> {
    console.log(this.configService.get<string>('GROQ_API_KEY'));
    return this._groq.chat.completions.create({ ...groqOptions, model });
  }
  async transcribeAudio(
    audioPath: string,
  ): Promise<Groq.Audio.Transcriptions.Transcription> {
    const fileStream = createReadStream(audioPath);
    return this._groq.audio.transcriptions.create({
      file: fileStream,
      model: 'distil-whisper-large-v3-en',
    });
  }
  //   async textToAudio(text: string): Promise<Groq.Audio.TextToSpeech.TextToSpeech> {
  //     return this._groq.audio.translations.create({
  //       model: 'tts-1',
  //       input: text,
  //       voice: 'shimmer',
  //     });
  //   }
}
