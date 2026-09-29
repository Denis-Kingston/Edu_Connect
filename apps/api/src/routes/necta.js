import { Router } from 'express';
import { prisma } from '../services/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { NectaService } from '../services/nectaService.js';

export const nectaRouter = Router();
const nectaService = new NectaService();

nectaRouter.post('/verify', requireAuth, requireRole('APPLICANT'), async (req, res) => {
  try {
    const { nectaIndexNumber, completionYear } = req.body || {};

    if (!nectaIndexNumber || !completionYear) {
      return res.status(400).json({ message: 'NECTA index number and completion year are required.' });
    }

    const result = await nectaService.verifyStudent({
      nectaIndexNumber,
      completionYear,
      userId: req.user.sub,
    });

    const user = await prisma.user.update({
      where: { id: req.user.sub },
      data: {
        nectaIndex: nectaIndexNumber,
      },
    });

    return res.status(200).json({
      data: { ...result, user: { id: user.id, nectaIndex: user.nectaIndex } },
    });
  } catch (error) {
    console.error('NECTA verification error:', error);
    return res.status(500).json({ message: error.message || 'NECTA verification failed.' });
  }
});
