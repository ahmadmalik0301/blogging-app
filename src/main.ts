import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma/prisma.exception';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3002',
    credentials: true,
  });
  app.use(cookieParser('secret'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Blogging Website backend')
    .setDescription(
      `This is a backend of a Blogging website, 
      where admin can perform CRUD operations on post. 
      Like User can login using Local and Google auth methods. 
      Post routes are protected using JWT`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
