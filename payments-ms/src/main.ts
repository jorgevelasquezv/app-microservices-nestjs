import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await app.startAllMicroservices();

  await app.listen(PORT);

  logger.log(`Payments Microservices is running on port: ${PORT}`);
}
bootstrap();
