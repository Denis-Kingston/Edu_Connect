# Edu_Connect Web — Frontend README

This README describes the code architecture, design decisions, and developer guidance for the Edu_Connect frontend (apps/web).

Overview
--------
The frontend is a React + Vite single-page application (SPA) scaffold optimized for mobile-first experiences. It serves applicant, university officer, and admin UIs. The scaffold is intentionally minimal, focusing on a clear component structure and progressive enhancement for low-bandwidth environments.

High-level architecture
-----------------------
- Entry point: src/main.jsx
- Root app: src/App.jsx
- Static assets: public/ or src/assets/
- Styles: src/styles.css (simple CSS for scaffold). Replace with CSS modules, Tailwind, or design system as needed.
- Component organization: group components by feature (auth, applicant, institutions, applications, payments).
- Data fetching: use fetch() or a lightweight client (axios). For production, prefer React Query or SWR for caching and background revalidation.

Suggested folder structure
--------------------------
apps/web/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── applicant/
│   │   ├── institution/
│   │   └── admin/
│   ├── pages/
│   ├── services/
│   │   └── apiClient.js
│   ├── hooks/
│   ├── styles.css
│   └── main.jsx

Routing and navigation
----------------------
- Use a simple router (React Router) to define routes for:
  - / — marketing / landing
  - /auth/login — login
  - /applicant/dashboard — applicant home
  - /applicant/apply — application form
  - /institution/dashboard — institution officer view
  - /admin — regulator and system admin views

Authentication & state management
---------------------------------
- JWT tokens: store access token in memory and a secure httpOnly refresh token cookie served by API to reduce XSS risk.
- Global user state: lightweight context provider or React Query for user session and profile data.
- Role-based UI: hide/show UI surface areas based on user role returned from /api/auth/me.

API integration
---------------
- Centralize API calls in src/services/apiClient.js and attach Authorization header.
- Handle 401 responses by attempting token refresh and redirecting to login when refresh fails.
- Use optimistic UI updates for application submission and show clear progress states for payments.

Accessibility & performance
---------------------------
- Mobile-first, responsive layout with accessible controls (aria-labels, keyboard navigation).
- Keep bundle sizes small: use code-splitting for large admin pages and lazy-load non-critical modules.
- Use image optimization, gzip/Brotli compression, and long-cache headers for assets.

Offline and resilience
----------------------
- Consider a PWA approach to allow applicants to draft applications offline and sync when connectivity returns.
- Provide retry and graceful failure for payment initiation and NECTA verification. Use local state to save drafts.

Testing
-------
- Unit tests with Jest and React Testing Library for components and custom hooks.
- E2E tests with Playwright or Cypress to validate happy paths (registration, NECTA verification, submit application, payment webhook simulation).

Build & deployment
------------------
- Build: npm --workspace apps/web run build
- Serve built assets with a CDN and a small static host (Vercel, Netlify, or behind a reverse proxy).
- Edge caching: cache landing and program catalog pages aggressively; protect dynamic authenticated endpoints.

Security
--------
- Protect tokens by using httpOnly refresh cookies; store transient access token in memory.
- Sanitize user inputs before sending to API; escape any content rendered as HTML.
- Use CSP headers provided by the API/reverse proxy.

Developer quick start
---------------------
1. Copy .env and configure API base URL if needed:

   cp .env.example .env

2. Install and run dev server:

   npm install
   npm --workspace apps/web run dev

3. Visit http://localhost:5173

Next steps
----------
- Implement a design system (Tailwind or CSS-in-JS) and consistent component library.
- Add robust state management (React Query) and form helpers (React Hook Form) for large application forms.
- Harden authentication flow with refresh tokens and server-side session controls.

See docs/architecture.md and docs/security.md for cross-cutting concerns and backend integration notes.
