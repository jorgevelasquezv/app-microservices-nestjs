import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { NastServerModule } from 'src/transports/nast-server.module';

@Module({
  controllers: [OrdersController],
  imports: [NastServerModule],
})
export class OrdersModule {}
