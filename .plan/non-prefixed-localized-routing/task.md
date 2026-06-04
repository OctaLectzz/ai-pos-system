# Refactoring localized routing to clean URLs (localePrefix: never)

- [x] Modify next-intl configuration (`src/i18n/routing.ts`) to use `localePrefix: 'never'`
- [x] Refactor Supabase middleware redirects (`src/lib/supabase/proxy.ts`)
- [x] Move/re-create root localized layout (`src/app/layout.tsx`) using server-side locales
- [x] Move/re-create root localized homepage (`src/app/page.tsx`)
- [x] Delete localized [locale] directories and file structures (`src/app/[locale]/`)
- [x] Run typechecks and production builds to verify compilation succeeds
