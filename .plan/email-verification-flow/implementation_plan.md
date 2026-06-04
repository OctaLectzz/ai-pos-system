# Email Verification Flow Implementation

This plan outlines the integration of an email verification flow following registration or upon login attempt with an unverified email.

## Proposed Changes

### Translations
#### [MODIFY] `messages/id/auth.json` and `messages/en/auth.json`
- Add a new `verifyEmail` namespace inside `auth.json` with keys for title, subtitle, check status button, and toast notifications.

### Authentication Hooks
#### [MODIFY] `src/hooks/use-auth.ts`
- **Register Mutation**: Update `onSuccess` to route the user to `/verify-email` instead of `/dashboard`.
- **Login Mutation**: Update `onError` to check if `error.code === 'email_not_confirmed'`. If true, display a specific toast and route the user to `/verify-email`.
- **Check Status**: Add a `checkVerificationStatus` function that manually calls `supabase.auth.getSession()` and pushes to `/dashboard` if a valid session is found.

### Pages
#### [NEW] `src/app/[locale]/(auth)/verify-email/page.tsx`
- Create the Email Verification page UI.
- Use `shadcn/ui` components to display a clear message asking the user to check their inbox.
- Implement a "Check Verification Status" button that calls `checkVerificationStatus` from `useAuth`.

## Verification Plan

### Manual Verification
1. **Registration**: Fill out the registration form, submit, and verify that the app redirects to `/verify-email`.
2. **Login Blocking**: Attempt to log in with an unconfirmed email and verify that the app redirects to `/verify-email`.
3. **Status Check**: On the `/verify-email` page, click "Check Verification Status" before confirming to ensure it doesn't bypass verification. Confirm the email in the Supabase logs/inbox, click it again, and verify the redirect to `/dashboard`.
