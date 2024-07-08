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
    origin: process.env.CLIENT_URL,
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
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Origin',
      'https://insta-clone-application.vercel.app',
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
