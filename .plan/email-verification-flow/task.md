# Email Verification Flow Tasks

- [x] Update `messages/en/auth.json` with `verifyEmail` keys.
- [x] Update `messages/id/auth.json` with `verifyEmail` keys.
- [x] Modify `src/hooks/use-auth.ts`:
  - Update `registerMutation.onSuccess` redirect.
  - Update `loginMutation.onError` to check `error.code`.
  - Add `checkVerificationStatus` and `isCheckingVerification` state.
- [x] Create `src/app/[locale]/(auth)/verify-email/page.tsx` UI and logic.
- [x] Type check and test (Manual verification).
