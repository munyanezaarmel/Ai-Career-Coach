import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './shared/config';
import { setupOpenApi } from './Openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  setupOpenApi(app);
  await app.listen(4999);
}
bootstrap();
