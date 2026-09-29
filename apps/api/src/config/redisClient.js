import crypto from 'crypto';
import { createClient } from 'redis';
import { env } from '../config/env.js';

let client;

export async function getRedisClient() {
  if (client) return client;
  client = createClient({ url: env.redisUrl });
  client.on('error', (err) => console.error('Redis error', err));
  await client.connect();
  return client;
}

export function verifyHmacSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signatureHeader, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}
