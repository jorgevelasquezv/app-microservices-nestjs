import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NastServerModule } from 'src/transports/nast-server.module';

@Module({
  controllers: [ProductsController],
  imports: [NastServerModule],
})
export class ProductsModule {}
