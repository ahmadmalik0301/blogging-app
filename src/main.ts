import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './ExceptionFilter/all.exception.filter';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Blogging Website backend')
    .setDescription(
      `This is a backend of a Blogging website, 
      where admin can perform CRUD operations on post. 
      Like User can login using Local and Google auth methods. 
      Post routes are protected using JWT (Beta phase not complete documentation yet)`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ✅ Health check route
  app.use('/health', (req: Request, res: Response) => {
    res.send('API is running');
  });
  await app.listen(configService.get<number>('PORT') ?? 3000, '0.0.0.0');
}

bootstrap();
