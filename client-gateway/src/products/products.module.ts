import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { PRODUCTS_SERVICE, envs } from '../config';

@Module({
  controllers: [ProductsController],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.productsMicroservicesHost,
          port: envs.productsMicroservicesPort,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
