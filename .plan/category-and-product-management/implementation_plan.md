# Phase 4: Category & Product Management

## Goal

Build complete CRUD for Categories and Products — Zod schemas, TypeScript types, API routes, TanStack React Query hooks, service functions, and UI components (forms, data tables, dialogs). Per the user's instructions:

- **Database fields**: `name`, `description` only (no `nameId`/`nameEn`/`descriptionId`/`descriptionEn`)
- **Form inputs**: Match the auth form pattern (Field/FieldGroup/FieldLabel/FieldError from `@/components/ui/field`)
- **No `any` type** anywhere
- **Reusable shared components**: `page-header`, `confirm-dialog`, `empty-state`, `data-table`, `search-input`, `loading-spinner`, `status-badge`
- **Verification build** at the end

> [!IMPORTANT]
> The Prisma schema currently uses `nameId`/`nameEn`/`descriptionId`/`descriptionEn` for both Category and Product. Per user request, we will modify the schema to use single `name` and `description` fields instead. This requires a Prisma schema change.

## Open Questions

> [!IMPORTANT]
> **Prisma Schema Modification**: The user explicitly asked for `name`, `description` (no locale-specific columns). This means we need to update `prisma/schema.prisma` to replace `nameId`/`nameEn`/`descriptionId`/`descriptionEn` with `name`/`description` on both `Category` and `Product` models. Is it okay to proceed with this schema change?

---

## Proposed Changes

### 1. Prisma Schema Update

#### [MODIFY] [schema.prisma](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/prisma/schema.prisma)

Update the `Category` model:
- Replace `nameId`, `nameEn` → single `name` field
- Replace `descriptionId`, `descriptionEn` → single `description` field

Update the `Product` model:
- Replace `nameId`, `nameEn` → single `name` field
- Replace `descriptionId`, `descriptionEn` → single `description` field

Add all required enums (`UserRole`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`, `OrderSource`, `ProductStatus`) and the full model set from ARCHITECTURE.md (Profile, Store, StoreMember, Category, Product, ProductImage, StockLog, Customer, Order, OrderItem, WhatsappSession, AuditLog, AiChatHistory).

---

### 2. Types

#### [NEW] [category.types.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/types/category.types.ts)

```typescript
interface Category {
  id: string
  storeId: string
  name: string
  description: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: { products: number }
}
```

#### [NEW] [product.types.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/types/product.types.ts)

```typescript
interface Product {
  id: string
  storeId: string
  categoryId: string
  sku: string
  name: string
  description: string | null
  price: number
  discountPrice: number | null
  costPrice: number | null
  stock: number
  minStockThreshold: number
  unit: string
  weight: number | null
  status: ProductStatus
  createdAt: string
  updatedAt: string
  category?: Category
  images?: ProductImage[]
}

type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
```

---

### 3. Zod Schemas

#### [NEW] [category.schema.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/schemas/category.schema.ts)

- `createCategorySchema`: `name` (required, 2-100 chars), `description` (optional, max 500), `sortOrder` (optional int), `isActive` (optional boolean)
- `updateCategorySchema`: same as create but all optional (partial)

#### [NEW] [product.schema.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/schemas/product.schema.ts)

- `createProductSchema`: `name`, `categoryId`, `price`, `sku` (optional auto-gen), `description`, `discountPrice`, `costPrice`, `stock`, `minStockThreshold`, `unit`, `weight`, `status`
- `updateProductSchema`: partial version
- `stockAdjustmentSchema`: `adjustment` (int), `reason` (string)

---

### 4. Service Layer

#### [NEW] [category.service.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/services/category.service.ts)

Functions: `getCategories()`, `getCategoryById()`, `createCategory()`, `updateCategory()`, `deleteCategory()` — all call API routes via `fetch()`.

#### [NEW] [product.service.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/services/product.service.ts)

Functions: `getProducts()`, `getProductById()`, `createProduct()`, `updateProduct()`, `deleteProduct()`, `adjustStock()` — all call API routes via `fetch()`.

---

### 5. TanStack React Query Hooks

#### [NEW] [use-categories.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/hooks/use-categories.ts)

- `useCategories()` — `useQuery` for listing
- `useCategory(id)` — `useQuery` for single
- `useCreateCategory()` — `useMutation` + invalidate + toast
- `useUpdateCategory()` — `useMutation` + invalidate + toast
- `useDeleteCategory()` — `useMutation` + invalidate + toast

#### [NEW] [use-products.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/hooks/use-products.ts)

- `useProducts()` — `useQuery` with filters (categoryId, status, search)
- `useProduct(id)` — `useQuery` for single
- `useCreateProduct()` — `useMutation` + invalidate + toast
- `useUpdateProduct()` — `useMutation` + invalidate + toast
- `useDeleteProduct()` — `useMutation` + invalidate + toast

---

### 6. API Routes

#### [NEW] [route.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/api/categories/route.ts) — `GET` (list) + `POST` (create)
#### [NEW] [route.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/api/categories/[id]/route.ts) — `GET`, `PUT`, `DELETE`
#### [NEW] [route.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/api/products/route.ts) — `GET` (list with pagination/filters) + `POST` (create)
#### [NEW] [route.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/api/products/[id]/route.ts) — `GET`, `PUT`, `DELETE`

All routes return `{ success, data, message }` format using the existing `successResponse`/`errorResponse` utilities.

---

### 7. Shared Reusable Components

#### [NEW] [page-header.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/page-header.tsx)

Page title + description + action buttons slot. Used on both categories and products pages.

#### [NEW] [confirm-dialog.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/confirm-dialog.tsx)

Reusable delete confirmation dialog with translated text, destructive variant button.

#### [NEW] [empty-state.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/empty-state.tsx)

Icon + title + description + optional CTA button for empty tables/lists.

#### [NEW] [data-table.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/data-table.tsx)

Generic wrapper around shadcn Table with loading skeleton state and empty state integration.

#### [NEW] [search-input.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/search-input.tsx)

Search input with debounce, icon, and clear button.

#### [NEW] [loading-spinner.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/loading-spinner.tsx)

Reusable loading spinner component.

#### [NEW] [status-badge.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/status-badge.tsx)

Generic badge for product/order status with color mapping.

---

### 8. Category Feature Components

#### [NEW] [category-list.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/categories/category-list.tsx)

Data table with columns: Name, Description, Products count, Status, Actions (edit/delete). Includes search, filter, and empty state.

#### [NEW] [category-form.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/categories/category-form.tsx)

Dialog-based form using Field/FieldGroup/FieldLabel/FieldError (matching auth pattern). Supports create and edit modes.

---

### 9. Product Feature Components

#### [NEW] [product-list.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/products/product-list.tsx)

Data table with columns: Name, SKU, Category, Price, Stock, Status, Actions. Includes search, category filter, status filter, and pagination.

#### [NEW] [product-form.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/products/product-form.tsx)

Dialog-based form for create/edit with the auth-style field components. Includes category select dropdown, price inputs, stock fields.

#### [NEW] [stock-adjustment-dialog.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/products/stock-adjustment-dialog.tsx)

Small dialog for quick stock adjustments (+/-) with reason field.

---

### 10. Pages

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/[locale]/(dashboard)/categories/page.tsx)

Categories management page — uses PageHeader + CategoryList + CategoryForm dialog.

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/[locale]/(dashboard)/products/page.tsx)

Products management page — uses PageHeader + ProductList + ProductForm dialog.

---

### 11. Translations

#### [NEW] [categories.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/en/categories.json) — English
#### [NEW] [categories.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/id/categories.json) — Indonesian
#### [NEW] [products.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/en/products.json) — English
#### [NEW] [products.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/id/products.json) — Indonesian

---

### 12. i18n Request Config Update

#### [MODIFY] [request.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/i18n/request.ts)

Add `categories` and `products` message imports to the message loading config.

---

### 13. Common Messages Update

#### [MODIFY] [common.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/en/common.json) — Add shared keys: `search`, `noResults`, `confirmDelete`, `create`, `back`, etc.
#### [MODIFY] [common.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/id/common.json) — Indonesian equivalents

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify no TypeScript errors, no build failures
- Run `npx prisma generate` to verify schema validity

### Manual Verification
- Visual check of categories and products pages in the browser (both light and dark modes)
- Test form validation (empty required fields, character limits)
- Test CRUD flow (create, list, edit, delete)
