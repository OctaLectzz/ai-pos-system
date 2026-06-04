# Implementation Plan — Phase 1 Foundation (Tasks 1.7 to 1.10)

This plan outlines the steps to build the foundational utilities, context providers, and internationalization routing in NexPOS without building any major UI components yet.

## User Review Required

> [!IMPORTANT]
> Please review the proposed list of core utilities and provider initializations. Since NexPOS runs on Next.js 16, it uses `proxy.ts` (instead of `middleware.ts`). We will integrate Supabase Session checks and next-intl routing inside the custom `proxy.ts` middleware.

## Proposed Changes

---

### 1. Foundational Types and Constants

We will create the basic API types and constant configs first.

#### [NEW] [api.types.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/types/api.types.ts)
- Type definitions for `ApiResponse<T>` matching the ARCHITECTURE.md standard.

#### [NEW] [constants.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/lib/constants.ts)
- Core app constants: supported locales, default locale, local storage keys, session duration parameters, and system status options.

---

### 2. Foundational Utilities

#### [NEW] [api-response.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/utils/api-response.ts)
- Standardized API response builder helpers `successResponse` and `errorResponse` returning a structured `NextResponse`.

#### [NEW] [format-currency.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/utils/format-currency.ts)
- Helper to format numbers into IDR (Indonesian Rupiah) currency string format (e.g. `Rp 15.000`).

#### [NEW] [format-date.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/utils/format-date.ts)
- Date formatter utilizing local locale contexts.

#### [NEW] [role-permissions.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/utils/role-permissions.ts)
- RBAC permission utility setting up role matrices (Superadmin, Admin, Operator) and verification helpers.

---

### 3. Context Providers

#### [NEW] [query-provider.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/providers/query-provider.tsx)
- React Query configuration and client provider (`QueryClientProvider`).

#### [NEW] [theme-provider.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/providers/theme-provider.tsx)
- `next-themes` theme provider supporting dark mode.

#### [NEW] [session-provider.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/providers/session-provider.tsx)
- Supabase session provider managing auth states.

#### [NEW] [toast-provider.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/providers/toast-provider.tsx)
- Configures Sonner Toast provider styled with tailwind CSS tokens.

---

### 4. Internationalization (next-intl) Setup

We will configure next-intl for routing, update the middleware/proxy, and restructure app routing.

#### [NEW] [routing.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/i18n/routing.ts)
- Setup locales (`['id', 'en']`) and routing structure using `next-intl/navigation`.

#### [NEW] [request.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/i18n/request.ts)
- Load locale messages dynamically.

#### [NEW] [common.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/id/common.json) & [common.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/en/common.json)
- Setup translation dictionaries for Indonesian and English.

#### [MODIFY] [proxy.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/proxy.ts)
- Chain next-intl middleware and Supabase Session Refresh to ensure locale prefix matching for auth redirects.

#### [NEW] [layout.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/[locale]/layout.tsx)
- Locale layout wrapping routing components under providers.

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/[locale]/page.tsx)
- Redirect or landing page localized inside `[locale]`.

#### [DELETE] Root-level page files in `src/app/`
- Delete `src/app/page.tsx` and `src/app/layout.tsx` to prevent routing conflicts.

---

## Verification Plan

### Automated Checks
- Verify typescript compilations (`npm run lint` or `npx tsc`).

### Manual Verification
- Check localization routes (e.g. accessing `/id/` and `/en/`) to ensure proper redirections and translations load.
- Ensure Supabase auth cookie-refresh handles unauthorized attempts by redirecting correctly to `/[locale]/login`.
