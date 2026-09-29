/**
 * Prisma seed script
 * Run: npx prisma db seed --preview-feature or node prisma/seed.js (after npx prisma generate)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create institutions
  const uday = await prisma.institution.upsert({
    where: { name: 'University of Dar es Salaam' },
    update: {},
    create: {
      name: 'University of Dar es Salaam',
      region: 'Dar es Salaam',
      type: 'public',
      capacity: 1800,
    },
  });

  const muhas = await prisma.institution.upsert({
    where: { name: 'Muhimbili University of Health and Allied Sciences' },
    update: {},
    create: {
      name: 'Muhimbili University of Health and Allied Sciences',
      region: 'Dar es Salaam',
      type: 'public',
      capacity: 1200,
    },
  });

  // Create programs
  await prisma.program.upsert({
    where: { name_institutionId: { name: 'BSc Computer Science', institutionId: uday.id } },
    update: {},
    create: {
      institutionId: uday.id,
      name: 'BSc Computer Science',
      description: 'Computer Science degree',
      minimumPoints: 70,
      applicationOpen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      applicationClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  }).catch(() => {});

  // Demo users
  await prisma.user.upsert({
    where: { email: 'applicant@example.com' },
    update: {},
    create: {
      firstName: 'Demo',
      lastName: 'Applicant',
      email: 'applicant@example.com',
      nectaIndex: 'S1234567',
      role: 'APPLICANT',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@example.com',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
