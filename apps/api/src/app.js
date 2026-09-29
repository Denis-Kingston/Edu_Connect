import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { institutionsRouter } from './routes/institutions.js';
import { applicationsRouter } from './routes/applications.js';
import { paymentsRouter } from './routes/payments.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'edu-connect-api', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/institutions', institutionsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/payments', paymentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
