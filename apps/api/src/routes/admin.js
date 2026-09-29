import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.get('/dashboard', requireAuth, requireRole('SUPER_ADMIN', 'REGULATOR'), (_req, res) => {
  res.status(200).json({
    data: {
      platformHealth: 'stable',
      activeApplicants: 24800,
      paymentSuccessRate: '98.7%',
      lastAudit: new Date().toISOString(),
    },
  });
});
