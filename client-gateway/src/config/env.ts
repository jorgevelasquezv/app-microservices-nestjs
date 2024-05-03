import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICES_HOST: string;
  PRODUCTS_MICROSERVICES_PORT: number;
  ORDERS_MICROSERVICES_HOST: string;
  ORDERS_MICROSERVICES_PORT: number;
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PRODUCTS_MICROSERVICES_HOST: joi.string().required(),
    PRODUCTS_MICROSERVICES_PORT: joi.number().required(),
    ORDERS_MICROSERVICES_HOST: joi.string().required(),
    ORDERS_MICROSERVICES_PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
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
  productsMicroservicesHost: enVars.PRODUCTS_MICROSERVICES_HOST,
  productsMicroservicesPort: enVars.PRODUCTS_MICROSERVICES_PORT,
  ordersMicroservicesHost: enVars.ORDERS_MICROSERVICES_HOST,
  ordersMicroservicesPort: enVars.ORDERS_MICROSERVICES_PORT,
  natsServers: enVars.NATS_SERVERS,
};
