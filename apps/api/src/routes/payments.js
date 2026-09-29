import { Router } from 'express';
import rawBody from 'raw-body';
import { requireAuth } from '../middleware/auth.js';
import { getRedisClient, verifyHmacSignature } from '../config/redisClient.js';
import { PaymentService } from '../services/paymentService.js';
import { prisma } from '../services/prisma.js';
import { env } from '../config/env.js';

export const paymentsRouter = Router();
const paymentService = new PaymentService(env.paymentProvider);

paymentsRouter.post('/initiate', requireAuth, async (req, res) => {
  const { amount, provider, reference } = req.body || {};

  if (!amount || !provider || !reference) {
    return res.status(400).json({ message: 'Amount, provider and reference are required.' });
  }

  const tx = await prisma.payment.create({
    data: {
      userId: req.user.sub,
      amount: Number(amount),
      provider,
      reference,
      status: 'PENDING',
    },
  });

  return res.status(201).json({ data: tx });
});

paymentsRouter.post('/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const raw = (await rawBody(req)).toString();

    if (!verifyHmacSignature(raw, signature, env.paymentWebhookSecret)) {
      return res.status(400).json({ message: 'Invalid webhook signature.' });
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return res.status(400).json({ message: 'Invalid JSON payload.' });
    }

    const idempotencyKey = payload.reference || payload.transactionId;
    if (!idempotencyKey) {
      return res.status(400).json({ message: 'Missing idempotency key in payload.' });
    }

    const redis = await getRedisClient();
    const key = `webhook:${idempotencyKey}`;
    const lock = await redis.set(key, 'processing', { NX: true, EX: 60 * 60 });
    if (!lock) {
      return res.status(200).json({ message: 'Duplicate webhook', status: 'duplicate' });
    }

    const reconciliation = await paymentService.reconcileTransaction(payload);

    await prisma.payment.upsert({
      where: { reference: idempotencyKey },
      update: {
        status: reconciliation.status.toUpperCase(),
        webhookSignature: String(signature || ''),
      },
      create: {
        userId: payload.userId || req.user?.sub || 'system-user',
        amount: Number(payload.amount || 0),
        provider: env.paymentProvider,
        reference: idempotencyKey,
        status: reconciliation.status.toUpperCase(),
        webhookSignature: String(signature || ''),
      },
    });

    await redis.set(key, 'done', { EX: 60 * 60 * 24 * 7 });

    return res.status(200).json({ message: 'Payment webhook processed successfully.' });
  } catch (error) {
    return next(error);
  }
});
