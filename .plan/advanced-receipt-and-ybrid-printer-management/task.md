# Phase 5.5 — Task Checklist

## 1. Database Schema
- [ ] Add `ReceiptSettings` model to `prisma/schema.prisma`
- [ ] Add `Printer` model to `prisma/schema.prisma`
- [ ] Add relations to `Store` model
- [ ] Run `npx prisma generate`

## 2. Types & Schemas
- [ ] Create `src/types/receipt.types.ts`
- [ ] Create `src/schemas/receipt.schema.ts`

## 3. API Routes
- [ ] Create `src/app/api/receipt-settings/route.ts` (GET, PUT)
- [ ] Create `src/app/api/printers/route.ts` (GET, POST)
- [ ] Create `src/app/api/printers/[id]/route.ts` (PUT, DELETE)

## 4. Services & Hooks
- [ ] Create `src/services/receipt.service.ts`
- [ ] Create `src/hooks/use-receipt-settings.ts`
- [ ] Create `src/hooks/use-printers.ts`

## 5. Translations
- [ ] Create `messages/en/receipt.json`
- [ ] Create `messages/id/receipt.json`

## 6. Utilities
- [ ] Create `src/utils/generate-receipt-html.ts`
- [ ] Create `src/services/print-service.ts` (hybrid routing)

## 7. UI Components
- [ ] Create `src/components/shared/receipt-preview.tsx`
- [ ] Create `src/components/settings/receipt-settings-form.tsx`
- [ ] Create `src/components/settings/printer-list.tsx`
- [ ] Create `src/components/settings/printer-form.tsx`

## 8. Pages
- [ ] Create `src/app/[locale]/(dashboard)/settings/receipt/page.tsx`
- [ ] Create `src/app/[locale]/(dashboard)/settings/printers/page.tsx`
- [ ] Create `src/app/[locale]/(dashboard)/settings/printers/guide/page.tsx`

## 9. Integrations
- [x] Integrate Receipt Preview into `pos-checkout-dialog.tsx` (success dialog).
- [x] Integrate Receipt Preview into `orders/[id]/page.tsx` (reprint button).
- [x] Update `app-sidebar.tsx` to include navigation links for Receipt Settings and Printer Management.
- [x] Verification: Final build check and UI/UX polish.
- [ ] All UI text uses translations
- [ ] No `any` types
