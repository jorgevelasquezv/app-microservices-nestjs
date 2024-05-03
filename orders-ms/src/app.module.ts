import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { NastServerModule } from './transports/nast-server.module';

@Module({
  imports: [OrdersModule, NastServerModule],
})
export class AppModule {}
