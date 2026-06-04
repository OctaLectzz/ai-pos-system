# Phase 2: Authentication and RBAC Implementation

This plan details the implementation of Phase 2 from `TASK_INSTRUCTION.md` and `SECURITY.md`. It covers setting up the Supabase auth callback, creating the Login and Register pages using clean URLs, building the Auth schemas with Zod, and updating the middleware for route protection.

## User Review Required

> [!IMPORTANT]
> The auth pages will be placed in `src/app/(auth)/login` and `src/app/(auth)/register` to match the clean URL routing established in Phase 1 (removing the `[locale]` prefix).

> [!WARNING]
> Since Prisma is not fully supported in Edge runtimes, the middleware (`src/proxy.ts` and `src/lib/supabase/proxy.ts`) will perform basic route protection (checking if a Supabase session exists). Detailed RBAC role verification from the database will be handled inside Server Components and API Routes rather than the Edge Middleware.

## Proposed Changes

---

### 1. API Routes & Middleware

#### [NEW] [route.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/api/auth/callback/route.ts)
- Add Supabase Auth callback route (`/api/auth/callback`) to exchange the auth code for a valid session.

#### [MODIFY] [proxy.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/lib/supabase/proxy.ts)
- Enhance the middleware logic to correctly protect `/dashboard`, `/settings`, and other internal routes by redirecting unauthenticated users to `/login`.
- Redirect authenticated users away from `/login` and `/register` to `/dashboard`.

---

### 2. Validation Schemas & I18n

#### [NEW] [auth.schema.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/schemas/auth.schema.ts)
- Create Zod schemas for Login (email, password).
- Create Zod schemas for Register (email, password, name), including strong password validation rules defined in `SECURITY.md`.

#### [NEW] [auth.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/messages/id/auth.json)
- Add translation keys for Auth UI (login, register, validation errors) in Indonesian.

#### [NEW] [auth.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/messages/en/auth.json)
- Add translation keys for Auth UI in English.

---

### 3. Hooks & Shared Utilities

#### [NEW] [use-auth.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/hooks/use-auth.ts)
- Create a React hook to handle Supabase login, register, and logout logic.

#### [MODIFY] [role-permissions.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/utils/role-permissions.ts)
- Verify that role definitions and `hasPermission` utilities are ready for use in server components.

---

### 4. Auth Components & Pages

#### [NEW] [login-form.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/auth/login-form.tsx)
- Create the Login Form using `react-hook-form`, `zod`, and `shadcn/ui` components.

#### [NEW] [register-form.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/auth/register-form.tsx)
- Create the Register Form.

#### [NEW] [layout.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/(auth)/layout.tsx)
- Create a layout to center the Auth forms on the screen.

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/(auth)/login/page.tsx)
- Create the main Login page rendering `LoginForm`.

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/(auth)/register/page.tsx)
- Create the main Register page rendering `RegisterForm`.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify type safety across all new files.
- Run `npm run build` to confirm static optimization succeeds without errors.

### Manual Verification
- Test accessing `/dashboard` without a session to verify redirect to `/login`.
- Test logging in and registering via the UI.
- Verify UI language updates properly.
