import { Router } from 'express';
import { prisma } from '../services/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const institutionsRouter = Router();

institutionsRouter.get('/', requireAuth, async (_req, res) => {
  const institutions = await prisma.institution.findMany({
    include: { programs: true },
  });

  return res.status(200).json({ data: institutions });
});

institutionsRouter.post('/', requireAuth, requireRole('SUPER_ADMIN', 'UNIVERSITY_OFFICER'), async (req, res) => {
  const payload = req.body || {};
  const institution = await prisma.institution.create({
    data: {
      name: payload.name,
      region: payload.region,
      type: payload.type || 'public',
      capacity: Number(payload.capacity || 0),
    },
  });

  return res.status(201).json({ data: institution });
});
