import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NastServerModule } from './transports/nast-server.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    NastServerModule,
    PaymentsModule,
    AuthModule,
  ],
})
export class AppModule {}
