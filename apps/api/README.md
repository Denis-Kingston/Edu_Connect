# Edu_Connect API — Backend README

This README describes the code architecture, design decisions, and developer guidance for the Edu_Connect backend (apps/api).

Overview
--------
The backend is a modular Node.js + Express API that implements authentication, NECTA verification, institution and program management, application processing, and payment webhook handling. It is designed to be production-ready with clear extension points for integrations (NECTA, mobile money providers), high-availability configuration, and observability hooks.

High-level architecture
-----------------------
- Entry point: src/server.js
- App composition: src/app.js (registers routers and global middleware)
- Routes: src/routes/
  - auth.js — login and token issuance (demo scaffold)
  - institutions.js — institutions and program endpoints
  - applications.js — application lifecycle endpoints
  - payments.js — payment initiation and webhook
- Services: src/services/
  - nectaService.js — NECTA verification abstraction (mocked in scaffold)
  - paymentService.js — payment reconciliation abstraction
- Middleware: src/middleware/
  - auth.js — JWT verification and RBAC helper
  - errorHandler.js — centralized error and 404 handling
- Config: src/config/
  - env.js — environment variables and defaults
  - db.js — PostgreSQL connection pool wrapper

Folder structure
----------------

apps/api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── ...
├── package.json

Design & patterns
-----------------
- Modular routers: feature-separated routers make it straightforward to split into microservices later.
- Services layer: business logic (NECTA, payments) is in services so it can be swapped for real integrations without changing route handlers.
- Middleware: JWT authentication and role-based guards sit in middleware to keep route code focused and testable.
- DB Layer: Prisma manages schema and migrations; db.js provides raw query helper when needed.
- Idempotency: Payment webhook handler uses reference/idempotency keys to guard against duplicate processing.

Key files to extend
-------------------
- src/services/nectaService.js: Replace the mock with a real HTTP client to NECTA, add retries and circuit breaker.
- src/services/paymentService.js: Integrate provider SDKs, verify webhook HMAC signatures.
- src/middleware/auth.js: Add token refresh and session revocation lists (Redis) for admin sessions.
- prisma/schema.prisma: Extend models (documents, audit logs, selection batches) and apply migrations.

Database & Migrations
---------------------
- Prisma is already configured (prisma/schema.prisma). Use:

  npx prisma migrate dev --name init
  npx prisma generate

- Seeders: create a prisma/seed.js to load initial institutions, programs, and test users.

Security & Compliance
---------------------
- Never allow direct grade overrides; implement a GradeLock model and administrative audit table.
- Field-level encryption for highly sensitive data (use libsodium or AWS KMS/Cloud KMS to manage keys).
- Use parameterized queries / ORM to prevent SQL injection.
- Ensure all external calls (NECTA, payment providers) are over TLS and use mutual authentication if required by the provider.

Scalability & Resilience
------------------------
- Run multiple API instances behind a load balancer (ALB, Nginx, or Traefik).
- Use Redis for caching static data (institutions, programs) and for distributed locks when processing selection batches.
- Use a connection pool with conservative max connections and rely on read replicas for read-heavy endpoints.
- Add rate-limiting and request throttling at the API gateway level to protect against spikes.

Observability
-------------
- Instrument requests and DB calls (OpenTelemetry or lightweight logging hooks).
- Centralize logs to a logging system (Elasticsearch, Loki, or managed logging like Papertrail).
- Add metrics (Prometheus/Grafana) for request rates, error rates, payment webhook timings, and NECTA verification latency.

Local development
-----------------
1. Copy environment variables:

   cp .env.example .env

2. Start local dependencies:

   docker compose up -d

3. Install dependencies and run API:

   npm install
   npm --workspace apps/api run dev

Testing guidance
----------------
- Unit tests: mock services (NECTA and payment providers) and test business logic.
- Integration tests: spin up ephemeral Postgres or use Docker Compose and run end-to-end flows for registration, verification, application submission, and payment webhook reconciliation.

Production notes
----------------
- Use managed Postgres with point-in-time recovery.
- Ensure database credentials are rotated regularly.
- Use CI to run migrations in a controlled pipeline and prevent schema drift.
- Disable demo users and replace auth endpoints with secure credential handling (bcrypt for passwords, MFA for admin accounts).

Useful scripts
--------------
- Start dev: npm --workspace apps/api run dev
- Run migrations: npx prisma migrate deploy
- Generate client: npx prisma generate

Contact
-------
For platform design and extension guidance, refer to docs/architecture.md and docs/security.md.
