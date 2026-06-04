# NexPOS — Implementation Plan

## Goal

Generate a complete, highly detailed set of project documentation and implementation guides for the **NexPOS** — an Omnichannel AI-Powered POS System integrated with WhatsApp. These documents serve as the blueprint for AI agents and developers to build the entire system from scratch.

---

## Summary of Work Completed

All **7 core documentation files** have been created in the `.agents/` directory:

| Document                | Purpose                                                           | Path                                                                                                          |
| :---------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **PRD.md**              | Product Requirements — features, user stories, personas, phases   | [PRD.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/PRD.md)                           |
| **ARCHITECTURE.md**     | System design — layers, database schema, API contracts, data flow | [ARCHITECTURE.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/ARCHITECTURE.md)         |
| **DESIGN.md**           | Design system — colors, typography, layout, components, dark mode | [DESIGN.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/DESIGN.md)                     |
| **SECURITY.md**         | Security architecture — auth, RBAC, validation, API/data security | [SECURITY.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/SECURITY.md)                 |
| **TESTING.md**          | Testing strategy — pyramid, tools, conventions, example tests     | [TESTING.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/TESTING.md)                   |
| **DEPLOYMENT.md**       | Deployment guide — Vercel, VPS, Supabase, CI/CD, monitoring       | [DEPLOYMENT.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/DEPLOYMENT.md)             |
| **TASK_INSTRUCTION.md** | Build instructions — 10-phase step-by-step guide for AI agents    | [TASK_INSTRUCTION.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/TASK_INSTRUCTION.md) |

---

## What Each Document Contains

### PRD.md (Product Requirements)

- Executive summary & vision statement
- 4 user personas (Superadmin, Admin, Operator, Customer)
- 9 feature areas with detailed specifications and user stories:
  - Authentication & RBAC (7 stories)
  - Dashboard (4 stories)
  - Category Management (5 stories)
  - Product Management (8 stories)
  - Order & Transaction Management (7 stories)
  - WhatsApp Bot Integration (9 stories)
  - Sales Reports & Analytics (6 stories)
  - Gemini AI Integration (5 stories)
  - Settings & Configuration (4 stories)
- Non-functional requirements (performance, scalability, accessibility, i18n)
- Data model summary & entity relationships
- 5 release phases

### ARCHITECTURE.md (System Architecture)

- System overview diagram (clients → servers → external services)
- 5-layer architecture (Presentation → Application → Service → Data → Infrastructure)
- **Complete directory structure** (~200 files mapped)
- **Full Prisma database schema** (14 models, 6 enums)
- Entity Relationship Diagram (Mermaid)
- API design with 30+ endpoints documented
- Auth flow sequence diagram
- RBAC permission matrix
- Key architectural decisions (with rationale)
- Data flow patterns (server fetch, client fetch, mutations, WhatsApp messages)
- Complete package dependency list with versions

### DESIGN.md (Design System)

- **Complete CSS variable system** for light and dark modes
- Color usage guide with semantic mappings
- Typography scale (Inter + JetBrains Mono)
- Dashboard layout wireframe
- Responsive breakpoints strategy
- Component design patterns (Card, DataTable, Form, Dialog)
- Animation & transition standards
- Icon system (Lucide React)
- Status badge designs (order, payment, product)
- Dark mode implementation rules
- Accessibility standards (WCAG 2.1 AA)
- WhatsApp message format designs (menu, receipt)

### SECURITY.md

- Defense-in-depth architecture
- Auth security (cookies, password requirements, OAuth, sessions)
- RBAC enforcement (middleware, API, UI, database layers)
- Input validation (double validation — client + server)
- API security (rate limiting, CORS, response safety)
- Data security (env vars, RLS, file upload validation)
- WhatsApp service security (shared secret, message sanitization)
- AI/Gemini security (prompt safety, data privacy)
- Security headers configuration
- Audit logging implementation
- Vulnerability prevention checklist

### TESTING.md

- Testing pyramid (Unit → Integration → E2E)
- Tool stack (Vitest, RTL, MSW, Playwright)
- Test file structure & naming conventions
- Example tests for: utilities, schemas, API routes, hooks, components, E2E flows
- Test data factory pattern
- NPM scripts for testing
- CI/CD pipeline configuration (GitHub Actions)

### DEPLOYMENT.md

- Dual deployment architecture (Vercel + VPS)
- Environment setup (all variables documented)
- Vercel deployment (config, build, checklist)
- VPS setup for WhatsApp service (PM2, Nginx, SSL)
- Database deployment (Prisma migrations, seeding)
- CI/CD pipeline (lint → test → build → deploy)
- Monitoring & observability
- Rollback procedures
- Performance optimization & caching strategy

### TASK_INSTRUCTION.md

- 10-phase implementation guide:
  1. Project Foundation (init, dependencies, folder structure, design system)
  2. Authentication & RBAC
  3. Dashboard Layout & Navigation
  4. Category & Product Management
  5. Order & Transaction Management
  6. Reports & Analytics
  7. WhatsApp Bot Integration
  8. AI Integration
  9. Settings & Admin
  10. Testing & Polish
- Each phase has specific tasks with file paths, commands, and checklists
- Code generation rules reminder

---

## User Review Required

> [!IMPORTANT]
> Please review the following aspects before I proceed with any implementation:

### 1. Color Palette

The design uses **Deep Navy Blue** as primary, **Teal** as secondary, and **Warm Amber** as accent. These are defined in [DESIGN.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/DESIGN.md). Do these colors match your brand vision?

### 2. Database Schema

The Prisma schema in [ARCHITECTURE.md](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/.agents/ARCHITECTURE.md) defines 14 models including multi-store support (Store + StoreMember). Is the multi-store architecture correct, or should it be single-store per admin?

### 3. WhatsApp Library Choice

The plan uses `whatsapp-web.js` (unofficial library, risk of bans). Alternatives include Baileys (lighter, socket-based) or the Official WhatsApp Cloud API (safe, but requires Meta business approval). Which do you prefer?

### 4. Auth Approach

The plan uses **Supabase Auth** (not NextAuth). This integrates natively with Supabase RLS and reduces dependencies. Is this acceptable?

### 5. Release Phase Priorities

The 5 phases go: Foundation → Commerce → WhatsApp → AI → Polish. Should any features be reprioritized?

---

## Open Questions

> [!NOTE]
> These questions can be deferred but will need answers during implementation:

1. **Store Model:** Single-store per admin or multi-store SaaS? Single-store
2. **Payment Integration:** Do you need real payment gateway integration (Midtrans, Xendit) or just manual tracking? manual tracking
3. **Notification System:** Email notifications for orders? Or only in-dashboard + WhatsApp? only in-dashboard + WhatsApp
4. **WhatsApp Bot Hosting:** Do you already have a VPS, or need guidance on provisioning one? already have a VPS
5. **Supabase Plan:** Free tier or Pro? (Affects connection limits and backup features) Pro
6. **Custom Domain:** Do you have a domain ready for deployment? yes

---
