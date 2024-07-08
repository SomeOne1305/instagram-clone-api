import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  // CORS
  app.enableCors({
    origin: [
      'https://insta-clone-application.vercel.app/',
      'https://insta-clone-application.vercel.app',
      'http://localhost:5173/',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Instagram clone')
    .setDescription(
      'Powered by <a href="https://github.com/SomeOne1305">Ahmadullo</a>',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(
    '/api',
    express.static(join(__dirname, '../node_modules/swagger-ui-dist')),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
