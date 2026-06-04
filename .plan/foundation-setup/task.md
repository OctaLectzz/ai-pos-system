# Phase 1 Foundation Tasks

- [x] Task 1.7 — Setup Core Utilities
    - [x] Create `src/types/api.types.ts`
    - [x] Create `src/lib/constants.ts`
    - [x] Create `src/utils/api-response.ts`
    - [x] Create `src/utils/format-currency.ts`
    - [x] Create `src/utils/format-date.ts`
    - [x] Create `src/utils/role-permissions.ts`
- [x] Task 1.8 — Setup Providers
    - [x] Create `src/providers/query-provider.tsx`
    - [x] Create `src/providers/theme-provider.tsx`
    - [x] Create `src/providers/session-provider.tsx`
    - [x] Create `src/providers/toast-provider.tsx`
- [x] Task 1.9 — Setup Internationalization (next-intl)
    - [x] Create next-intl configurations (`src/i18n/routing.ts`, `src/i18n/request.ts`)
    - [x] Create dictionary directories and JSON files (`messages/id/common.json`, `messages/en/common.json`)
    - [x] Update `src/proxy.ts` to merge auth checks and locale routing
    - [x] Restructure routes to `src/app/[locale]` (move layout/page, update next.config.ts)
- [x] Task 1.10 — Install shadcn/ui Components
