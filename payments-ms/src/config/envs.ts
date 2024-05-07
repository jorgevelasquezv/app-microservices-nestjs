import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const enVars: EnvVars = value;

export const envs = {
  port: enVars.PORT,
  stripeSecret: enVars.STRIPE_SECRET,
  stripeWebhookSecret: enVars.STRIPE_WEBHOOK_SECRET,
  stripeSuccessUrl: enVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: enVars.STRIPE_CANCEL_URL,
};
