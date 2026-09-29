import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getRedisClient, verifyHmacSignature } from '../config/redisClient.js';
import { PaymentService } from '../services/paymentService.js';
import rawBody from 'raw-body';
import { env } from '../config/env.js';

export const paymentsRouter = Router();

const transactions = [];
const paymentService = new PaymentService(env.paymentProvider);

// Initiate a payment (example)
paymentsRouter.post('/initiate', requireAuth, (req, res) => {
  const { amount, provider, reference } = req.body || {};

  if (!amount || !provider || !reference) {
    return res.status(400).json({ message: 'Amount, provider, and reference are required' });
  }

  const tx = {
    id: `txn-${Date.now()}`,
    applicantId: req.user.sub,
    amount,
    provider,
    reference,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  transactions.push(tx);

  return res.status(201).json({ data: tx });
});

// Webhook endpoint with HMAC verification and Redis-backed idempotency
paymentsRouter.post('/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['x-webhook-signature'];

    // Get the raw request body for HMAC verification
    const raw = (await rawBody(req)).toString();

    if (!verifyHmacSignature(raw, signature, env.paymentWebhookSecret)) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    const idempotencyKey = payload.reference || payload.transactionId;
    if (!idempotencyKey) {
      return res.status(400).json({ message: 'Missing idempotency key in payload' });
    }

    const redis = await getRedisClient();
    const lockKey = `webhook:${idempotencyKey}`;

    // Try to acquire a one-time lock for this webhook (set NX)
    const setResult = await redis.set(lockKey, 'processing', { NX: true, EX: 60 * 60 });
    if (!setResult) {
      // Another process has already processed or is processing this webhook
      return res.status(200).json({ message: 'Duplicate webhook', status: 'duplicate' });
    }

    // Reconcile transaction using the payment service
    const reconciliation = await paymentService.reconcileTransaction(payload);

    // Persist reconciliation in-memory for scaffold. Replace with DB persistence in production.
    const existing = transactions.find((tx) => tx.reference === idempotencyKey);
    if (existing) {
      existing.status = reconciliation.status || 'success';
      existing.updatedAt = new Date().toISOString();
    } else {
      transactions.push({
        id: `txn-${Date.now()}`,
        applicantId: payload.userId || null,
        amount: payload.amount,
        provider: env.paymentProvider,
        reference: idempotencyKey,
        status: reconciliation.status || 'success',
        createdAt: new Date().toISOString(),
      });
    }

    // Optionally set a final state key to prevent reprocessing long-term
    await redis.set(lockKey, 'done', { EX: 60 * 60 * 24 * 7 });

    return res.status(200).json({ message: 'Payment webhook processed successfully' });
  } catch (err) {
    return next(err);
  }
});
