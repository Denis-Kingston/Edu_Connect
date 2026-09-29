# Edu_Connect

Edu_Connect is a full-stack admissions platform for Tanzanian students applying to universities, colleges, and technical institutions. The project is designed around the Tanzania Student University Application Platform (TSUAP) concept and supports applicant onboarding, NECTA-based academic verification, university program management, payment handling, role-based access, and admin/regulator oversight.

## Project goals

- Simplify application submission for secondary school graduates
- Support mobile-first applicant experiences in Tanzania
- Integrate with NECTA verification services for academic validation
- Allow universities to manage programs, capacity, and application windows
- Support secure payment reconciliation and audit logging
- Provide dashboards for applicants, universities, regulators, and system administrators

## Architecture summary

This repository follows a modular monorepo design:

- apps/api: Express.js backend with Prisma and PostgreSQL
- apps/web: React + Vite frontend for applicant, university, and admin experiences
- prisma: database schema, migrations, and seed data
- docs: architecture, governance, and security documentation
- .github/workflows: CI pipeline for validation and build checks

## Tech stack

- Backend: Node.js, Express, Prisma, PostgreSQL, Redis, JWT
- Frontend: React, Vite, React Router
- Security: bcrypt, JWT RBAC, HMAC webhook verification, audit logging
- Deployment support: Docker Compose, CI/CD workflows, environment-driven config

## Repository structure

```text
Edu_Connect/
├── apps/
│   ├── api/
│   │   ├── README.md
│   │   ├── package.json
│   │   └── src/
│   └── web/
│       ├── README.md
│       ├── package.json
│       └── src/
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── docs/
│   ├── architecture.md
│   ├── security.md
│   └── erd.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
└── apps/api/openapi.yaml
```

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Docker Desktop (optional but recommended for local database and cache services)

### 1. Clone and install dependencies

```bash
npm install
npm --workspace apps/api install
npm --workspace apps/web install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Update the database and secret values in `.env` as needed.

### 3. Start local services

```bash
docker compose up -d
```

This starts PostgreSQL and Redis for local development.

### 4. Run Prisma migrations and seed

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

### 5. Run the application

Start the API:

```bash
npm --workspace apps/api run dev
```

Start the frontend:

```bash
npm --workspace apps/web run dev
```

Open the frontend in the browser at:

- http://localhost:5173

API health check:

- http://localhost:4000/health

## Demo accounts

The scaffold includes demo authentication for role-based access:

- Applicant: applicant@example.com / password123
- Super Admin: admin@example.com / adminpass

## Core features implemented in the scaffold

- JWT authentication and role enforcement
- RBAC-based access to institution and application endpoints
- Prisma-backed persistence layer for users, institutions, programs, applications, and payments
- Payment webhook HMAC verification with idempotency handling
- Seed data for institutions and sample programs
- Applicant, university, and admin dashboard screens
- CI workflow for build validation

## Security and compliance considerations

This project is designed with Tanzanian public-sector and education-sector compliance in mind:

- Audit logging for sensitive actions
- Encrypted secret management via environment variables
- Secure webhook validation with HMAC signatures
- Avoidance of direct grade overrides without audit trail
- Idempotent payment handling to prevent duplicate processing

## Development roadmap

Planned next steps include:

- Full NECTA API integration with verification and grade locking
- Real payment provider integrations (mobile money / bank gateways)
- Enhanced applicant application workflows and institution dashboards
- Improved analytics, reporting, and regulator dashboards
- Production deployment automation and Kubernetes / cloud provisioning

## License

MIT
