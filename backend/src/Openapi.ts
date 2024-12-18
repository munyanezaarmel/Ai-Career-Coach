import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Sangwas marketplace')
  .setDescription('API documentation for sangwas')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const setupOpenApi = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
