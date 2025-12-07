import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security and Middleware setup
  app.use(cookieParser());
  app.use(helmet());

  // Use global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS configuration
  const allowedOrigins = [
    'https://insta-clone-application.vercel.app',
    'http://localhost:5173',
    (process.env.VERCEL_URL as string) || 'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked CORS request from origin: ${origin}`);
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: true,
    methods: '*',
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Instagram Clone')
    .setDescription(
      'Powered by <a href="https://github.com/SomeOne1305">Ahmadullo</a>',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serve Swagger UI static files (optional if you use built-in Swagger setup)
  app.use(
    '/api',
    express.static(join(__dirname, '../node_modules/swagger-ui-dist')),
  );

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
