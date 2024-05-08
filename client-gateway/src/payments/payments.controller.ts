import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto';
import { NATS_SERVICE } from '../config';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}
  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.client.send('create.payment.session', paymentSessionDto);
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment session created successfully',
    };
  }

  @Get('cancel')
  cancel() {
    return {
      ok: true,
      message: 'Payment session cancelled',
    };
  }
}
