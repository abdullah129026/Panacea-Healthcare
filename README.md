# Panacea Portal — Clinical Operations Management Platform

A **full-stack, multi-tenant clinical operations platform** for hospitals and clinics. Built with Next.js 16 (frontend) and Node.js/Express (backend).

## Project Structure

Live link: https://panacea-demo.netlify.app            Note : it is just a UI demo of the project not full complete implemention of the project


```
panacea/
├── frontend/          # Next.js 16 + React 19 + Tailwind CSS v4
├── backend/           # Node.js + Express + PostgreSQL + Prisma
├── README.md          # This file
└── .gitignore         # Root-level git ignore
```

## Quick Start

### Prerequisites
- **Node.js** 18+ 
- **PostgreSQL** 15+ (local or managed)
- **npm** or **yarn**

### Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Update .env.local with your API_BASE_URL (default: http://localhost:4000/api)
npm run dev
# Frontend runs on http://localhost:3000
```

### Setup Backend

```bash
cd backend
npm install
cp .env.example .env.local
# Update .env.local with:
#   DATABASE_URL = your PostgreSQL connection
#   JWT_SECRET = a secure random string (min 32 chars)
#   JWT_REFRESH_SECRET = another secure random string
#   FRONTEND_URL = http://localhost:3000 (for CORS)

# Setup database
npm run db:push        # Apply Prisma schema to DB
npm run db:seed        # Populate with demo data

npm run dev
# Backend runs on http://localhost:4000
```

### Test Auth Endpoints

Once both are running:

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "MySecureP@ss1234",
    "name": "Test User",
    "clinicName": "Test Clinic",
    "agree": true
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "MySecureP@ss1234"
  }'
```

Then open http://localhost:3000 and log in with your credentials.

---

## Project Phases

### ✅ Phase 0 — Foundations (Complete)
- TypeScript, Tailwind, Zod, vitest, Playwright setup
- Environment configuration, API client, domain types

### ✅ Phase 1 — Authentication (Complete)
- Custom JWT session strategy
- Login, register, password reset flows
- Route protection via middleware
- RBAC (Role-Based Access Control)
- Multi-tenancy support

### ✅ Phase 2 — Data Layer (Complete)
- Patients, Appointments, Medical Records, Billing, Inventory
- AI Clinical Decision Support (CDS) risk scoring
- Clinical Operations, Reports, Communications
- Dashboard with KPIs and real-time alerts

### ✅ Phase 3 — Settings & Account (Complete)
- User profile, security settings, 2FA setup
- Clinic administration and member invites
- Notification preferences
- Billing settings

### ✅ Phase 4 — Real-Time & Support (Complete)
- WebSocket/polling for live events
- Alert system with dismissal + snooze
- Live chat support widget

### 🔄 Phase 5 — Hardening & Quality (In Progress)
- Design token migration (no hardcoded colors)
- Accessibility improvements
- Performance optimization
- Security audit
- Test coverage expansion

### 📋 Phase 6 — Release (Pending)
- Staging environment
- CI/CD pipeline
- Monitoring & error reporting
- Production deployment

---

## Backend Status

| Phase | Component | Status |
|-------|-----------|--------|
| B0 | Infrastructure & Setup | ✅ Complete |
| B1 | Database & Prisma Schema | ✅ Complete |
| B2 | Authentication & Authorization | ✅ Complete |
| B3 | Core CRUD APIs | 📋 Next |
| B4 | WebSocket & Real-Time | 📋 Pending |
| B5 | File Upload (Cloudinary) | 📋 Pending |
| B6 | Email & Notifications (SendGrid) | 📋 Pending |
| B7 | Testing & Quality | 📋 Pending |

---

## Key Features

### For Clinicians
- **Patient Dashboard** — search, filter, view full medical history
- **Appointments** — schedule, reschedule, cancel with conflict detection
- **AI Risk Scoring** — clinical decision support for patient triage
- **Medical Records** — upload, download, organize documents
- **Communications** — secure messaging with staff

### For Administrators
- **Clinic Management** — add staff, manage roles, invite new users
- **Billing** — invoice management, revenue tracking
- **Inventory** — stock management, reorder alerts
- **Reports** — analytics, performance metrics, data export

### For Support Agents
- **Support Hub** — ticket management, live chat
- **Escalation** — route urgent issues to clinicians

---

## Architecture

### Frontend (Next.js 16)
- **Server Components by default** — RSC for data fetching
- **Client Leaf Components** — modals, inputs, interactive UI
- **Server Actions** — form submissions, mutations
- **API Client** — `src/lib/api/` wraps fetch with auth headers, tenant scoping
- **UI Primitives** — 8+ reusable components (Button, Card, Modal, etc.)
- **Design Tokens** — Tailwind v4 CSS variables (no hardcoded colors)

### Backend (Node.js + Express)
- **PostgreSQL + Prisma** — type-safe ORM with migrations
- **JWT Authentication** — HS256, 24h access tokens, 7d refresh tokens
- **Multi-Tenant** — clinic-scoped data isolation
- **Role-Based Access** — clinician, admin, support, billing
- **Validation** — Zod schemas, server-side enforcement
- **Error Handling** — consistent error responses, logged with context
- **Testing** — Vitest for unit, Playwright for E2E

---

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### Backend (`.env.local`)
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/panacea_dev
JWT_SECRET=<min-32-char-random-string>
JWT_REFRESH_SECRET=<min-32-char-random-string>
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=<added-in-phase-b5>
SENDGRID_API_KEY=<added-in-phase-b6>
REDIS_URL=<added-in-phase-b4>
```

---

## Scripts

### Frontend
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # ESLint + format
npm run typecheck    # TypeScript check
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright E2E tests
```

### Backend
```bash
npm run dev          # Start dev server (http://localhost:4000)
npm run build        # TypeScript build
npm run start        # Start production server
npm run lint         # ESLint + format
npm run typecheck    # TypeScript check
npm run test         # Vitest unit tests
npm run db:push      # Apply Prisma schema
npm run db:migrate   # Create migration
npm run db:seed      # Run seed script
```

---

## Code Standards

### TypeScript
- Strict mode enabled, no `any`
- Explicit return types on all functions
- Use `type` for shapes, `interface` for extendable props

### Next.js Conventions
- Server Components by default, `"use client"` on leaves
- Data fetching in RSCs or Server Actions
- Route groups `(auth)`, `(portal)` for layout scoping

### Styling
- **No hardcoded colors** — use design tokens (`bg-primary`, `text-foreground`)
- **Tailwind v4 CSS variables** defined in `frontend/src/app/globals.css`
- `cn()` helper for class composition

### Backend
- Every route wrapped in `asyncHandler` for error catching
- Validation with Zod before API calls
- Return shape: `{ success, data?, error? }`
- Log errors with `[area/name]` prefix

---

## Database Schema

### Core Entities
- **Clinic** — tenant, scopes all data
- **User** — staff member (clinician, admin, support, billing)
- **Patient** — medical records, vitals, status
- **Appointment** — scheduling, notes, status
- **MedicalRecord** — documents, files
- **Invoice** — billing, line items
- **InventoryItem** — stock tracking
- **RiskScore** — AI CDS output
- **AuditLog** — HIPAA compliance tracking

See `backend/prisma/schema.prisma` for full schema.

---

## Testing

### Unit Tests
```bash
cd frontend
npm run test

cd ../backend
npm run test
```

### E2E Tests (Frontend)
```bash
cd frontend
npm run test:e2e
```

### Manual Testing
1. Start both frontend + backend
2. Visit http://localhost:3000
3. Register a new account
4. Explore the dashboard, patients, appointments, etc.

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Railway, Render, Fly.io)
```bash
cd backend
# Follow platform's deployment guide
# Environment secrets: DATABASE_URL, JWT_SECRET, etc.
```

### Database (Managed PostgreSQL)
- Heroku Postgres, AWS RDS, Railway, Neon, or similar
- Update `DATABASE_URL` in backend secrets

---

## Support & Issues

For bugs, feature requests, or questions:
1. Check existing issues on GitHub
2. Create a new issue with reproduction steps
3. Include environment (Node version, OS, etc.)

---

## License

Proprietary — Panacea Portal. All rights reserved.

---

## Authors

Built by the Panacea team. Current phase lead: AI Agent (Claude).

---

**Last Updated:** July 15, 2026  
**Current Phase:** B2 Auth Complete, Frontend Phases 1-4 Complete  
**Next:** Backend B3 CRUD APIs
