import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Request, Response } from 'express';

import { envs } from '../config';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });
    return session;
    // return paymentSessionDto;
  }

  stripeWebhook(req: Request, res: Response) {
    console.log('Stripe webhook called');

    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        envs.stripeWebhookSecret,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'charge.succeeded': {
        const chargeSucceeded = event.data.object;
        console.log(
          `Payment intent was successful: ${JSON.stringify(chargeSucceeded.payment_intent)}`,
          chargeSucceeded.metadata,
        );
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ sig });
  }
}
