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

institutionsRouter.post('/:institutionId/programs', requireAuth, requireRole('SUPER_ADMIN', 'UNIVERSITY_OFFICER'), async (req, res) => {
  const { institutionId } = req.params;
  const payload = req.body || {};

  const program = await prisma.program.create({
    data: {
      institutionId,
      name: payload.name,
      description: payload.description || '',
      minimumPoints: Number(payload.minimumPoints || 0),
      applicationOpen: new Date(payload.applicationOpen || Date.now()),
      applicationClose: new Date(payload.applicationClose || Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  return res.status(201).json({ data: program });
});
