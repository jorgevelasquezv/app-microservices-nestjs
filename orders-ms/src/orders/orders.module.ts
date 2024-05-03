import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NastServerModule } from '../transports/nast-server.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [NastServerModule],
})
export class OrdersModule {}
