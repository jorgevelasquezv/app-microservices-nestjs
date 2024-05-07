import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { AppModule } from './app.module';
import { envs } from './config';

const PORT = envs.port;

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT);

  logger.log(`Payments Microservices is running on port: ${PORT}`);
}
bootstrap();
