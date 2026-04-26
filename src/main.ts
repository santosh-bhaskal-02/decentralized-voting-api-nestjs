import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle('Voting System API')
    .setDescription('API documentation for the voting system')
    .setVersion('1.0')
    .addTag('voting')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, { swaggerOptions: { persistAuthorization: true } });

  await app.listen(process.env.PORT ?? 5249);
}
bootstrap();
