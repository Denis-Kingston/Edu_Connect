-- Sample SQL migration to seed initial schema structure
-- This is illustrative. Use `npx prisma migrate dev --name init` in real workflows.

BEGIN;

CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  "phoneNumber" TEXT,
  "nectaIndex" TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'APPLICANT',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Institution" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  type TEXT,
  capacity INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Program" (
  id TEXT PRIMARY KEY,
  "institutionId" TEXT REFERENCES "Institution"(id),
  name TEXT,
  description TEXT,
  "minimumPoints" INTEGER,
  "applicationOpen" TIMESTAMP WITH TIME ZONE,
  "applicationClose" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Application" (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"(id),
  "institutionId" TEXT REFERENCES "Institution"(id),
  program TEXT,
  "choiceOrder" TEXT[],
  status TEXT DEFAULT 'SUBMITTED',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Payment" (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"(id),
  amount NUMERIC,
  provider TEXT,
  reference TEXT UNIQUE,
  status TEXT DEFAULT 'PENDING',
  "webhookSignature" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMIT;
