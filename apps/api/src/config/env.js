import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/edu_connect?schema=public',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  paymentProvider: process.env.PAYMENT_PROVIDER || 'azampay',
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'dev-webhook-secret',
};
