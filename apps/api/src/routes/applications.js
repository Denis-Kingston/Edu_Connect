import { Router } from 'express';
import { prisma } from '../services/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const applicationsRouter = Router();

applicationsRouter.get('/', requireAuth, async (req, res) => {
  const where = req.user.role === 'APPLICANT' ? { userId: req.user.sub } : {};

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ data: applications });
});

applicationsRouter.get('/:id', requireAuth, async (req, res) => {
  const application = await prisma.application.findUnique({
    where: { id: req.params.id },
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  if (req.user.role === 'APPLICANT' && application.userId !== req.user.sub) {
    return res.status(403).json({ message: 'Not allowed to view this application.' });
  }

  return res.status(200).json({ data: application });
});

applicationsRouter.post('/submit', requireAuth, requireRole('APPLICANT'), async (req, res) => {
  const { institutionId, program, choices } = req.body || {};

  if (!institutionId || !program || !Array.isArray(choices) || choices.length === 0) {
    return res.status(400).json({ message: 'Institution, program, and choice list are required.' });
  }

  if (choices.length > 5) {
    return res.status(400).json({ message: 'You may submit up to five choices.' });
  }

  const application = await prisma.application.create({
    data: {
      userId: req.user.sub,
      institutionId,
      program,
      choiceOrder: choices,
      status: 'SUBMITTED',
    },
  });

  return res.status(201).json({ data: application });
});

applicationsRouter.patch('/:id/status', requireAuth, requireRole('SUPER_ADMIN', 'UNIVERSITY_OFFICER'), async (req, res) => {
  const { status } = req.body || {};
  const app = await prisma.application.update({
    where: { id: req.params.id },
    data: { status },
  });

  return res.status(200).json({ data: app });
});
