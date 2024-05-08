import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  STRIPE_SECRET: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const enVars: EnvVars = value;

export const envs = {
  port: enVars.PORT,
  natsServers: enVars.NATS_SERVERS,
  stripeSecret: enVars.STRIPE_SECRET,
  stripeWebhookSecret: enVars.STRIPE_WEBHOOK_SECRET,
  stripeSuccessUrl: enVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: enVars.STRIPE_CANCEL_URL,
};
