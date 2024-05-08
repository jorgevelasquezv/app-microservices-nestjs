import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { NastServerModule } from 'src/transports/nast-server.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [NastServerModule],
})
export class PaymentsModule {}
