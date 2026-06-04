# Implementation Plan — Non-prefixed (Clean URL) Localized Routing

This plan refactors next-intl and Supabase proxy middleware to support clean URLs (e.g. `/login` instead of `/id/login` or `/en/login`). We will remove the `[locale]` segment and configure next-intl with `localePrefix: 'never'`.

## User Review Required

> [!IMPORTANT]
> The `/id` and `/en` URL prefixes will be completely removed from the router pathnames. Localizations will be resolved dynamically via cookies or request headers by the middleware. Root app routes like `src/app/page.tsx` and `src/app/layout.tsx` will be restored to root.

## Proposed Changes

---

### 1. Internationalization Configuration

#### [MODIFY] [routing.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/i18n/routing.ts)
- Change `localePrefix` to `'never'` in `defineRouting`.

---

### 2. Middleware & Proxy Refactoring

#### [MODIFY] [proxy.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/lib/supabase/proxy.ts)
- Revert auth check redirects back to clean routes (e.g. `/login` instead of `/[locale]/login`), as routes will no longer have prefixes.

---

### 3. Folder & Route Restructuring

#### [NEW] [layout.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/layout.tsx)
- Re-create root layout using `await getLocale()` and `await getMessages()` to feed localizations into providers.

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/page.tsx)
- Re-create root localized page using async `await getTranslations()` helper.

#### [DELETE] Localized segments in `src/app/[locale]`
- Delete `src/app/[locale]/layout.tsx`
- Delete `src/app/[locale]/page.tsx`
- Remove the `[locale]` folder directory.

---

## Verification Plan

### Automated Checks
- Verify type safety compile using `npx tsc --noEmit`.
- Run production build `npm run build` to confirm static optimization succeeds without prerender errors.

### Manual Verification
- Access `http://localhost:3000/` and verify that the page loads clean (no `/id` in the address bar) and translates text correctly.
- Verify unauthenticated route requests redirect cleanly to `/login` without looping or appending prefixes.
