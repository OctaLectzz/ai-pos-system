# Phase 5: Order & Transaction Management

Implement the full order lifecycle: API routes for orders, manual POS interface (product grid + cart), order history table, order detail page, and inventory decrement on order completion.

## User Review Required

> [!IMPORTANT]
> **Payment Status Badge**: The `StatusBadge` component already has `ORDER_STATUS_MAP` but no `PAYMENT_STATUS_MAP`. I will add payment status config (`PENDING`, `PAID`, `PARTIAL`, `REFUNDED`) to the existing `status-badge.tsx`.

> [!IMPORTANT]
> **Store ID**: The existing API routes use `storeId: 'default-store'` as a placeholder (same pattern in categories & products). I will continue this pattern for orders. Proper multi-tenant auth will be addressed in a later phase.

---

## Proposed Changes

### 1. Utility — Order ID Generator

#### [NEW] [generate-order-id.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/utils/generate-order-id.ts)
- Format: `NX-YYYYMMDD-XXXX` (e.g., `NX-20260605-0001`)
- Queries DB for the latest order number of the current day to determine the next sequence

---

### 2. Types

#### [NEW] [order.types.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/types/order.types.ts)
- `OrderStatus`, `PaymentStatus`, `PaymentMethod`, `OrderSource` string union types
- `OrderItem` interface (id, productId, productName, quantity, unitPrice, subtotal)
- `Order` interface (full order with items, customer info, timestamps)
- `OrderListParams` interface (search, status, paymentStatus, source, page, pageSize, dateFrom, dateTo)

---

### 3. Schema (Zod Validation)

#### [NEW] [order.schema.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/schemas/order.schema.ts)
- `createOrderItemSchema` — productId (required), quantity (positive int)
- `createOrderSchema` — items array (min 1), paymentMethod, customerName, customerPhone, notes, source
- `updateOrderStatusSchema` — status (enum), paymentStatus (enum), paymentMethod (enum optional)

---

### 4. API Routes

#### [NEW] [route.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/api/orders/route.ts)
- **GET**: List orders with pagination, filters (status, paymentStatus, source, search by orderNumber/customerName, date range)
- **POST**: Create order in a transaction:
  1. Generate order number via `generateOrderId()`
  2. Look up each product to get price & name (snapshot)
  3. Calculate subtotal per item, total, tax
  4. Create Order + OrderItems
  5. Decrement product stock for each item
  6. Create StockLog entries (reason: "order", referenceId: orderId)
  7. If any product has insufficient stock → rollback & return 400

#### [NEW] [route.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/api/orders/[id]/route.ts)
- **GET**: Get order by ID with items, customer
- **PUT**: Update order status/payment. When status → `CANCELLED`, restore stock (reverse inventory decrement). When status → `COMPLETED`, set `completedAt`.

---

### 5. Service Layer

#### [NEW] [order.service.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/services/order.service.ts)
- `getOrders(params)` — axios GET `/api/orders`
- `getOrderById(id)` — axios GET `/api/orders/[id]`
- `createOrder(data)` — axios POST `/api/orders`
- `updateOrderStatus(id, data)` — axios PUT `/api/orders/[id]`

---

### 6. Hooks (TanStack React Query)

#### [NEW] [use-orders.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/hooks/use-orders.ts)
- `useOrders(params)` — useQuery
- `useOrder(id)` — useQuery
- `useCreateOrder()` — useMutation + invalidate + toast
- `useUpdateOrderStatus()` — useMutation + invalidate + toast

---

### 7. Translations

#### [NEW] [orders.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/en/orders.json)
#### [NEW] [orders.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/id/orders.json)
#### [NEW] [pos.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/en/pos.json)
#### [NEW] [pos.json](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/messages/id/pos.json)

Translation keys for: page titles, table headers, form labels, status labels, toast messages, validation errors, POS interface text, empty states.

#### [MODIFY] [request.ts](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/i18n/request.ts)
- Add `orders` and `pos` imports to the message loader

---

### 8. Shared Component Updates

#### [MODIFY] [status-badge.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/shared/status-badge.tsx)
- Add `PAYMENT_STATUS_MAP` (PENDING → amber, PAID → emerald, PARTIAL → blue, REFUNDED → muted)
- Add `type: 'payment'` option to the component

---

### 9. Order Components

#### [NEW] [order-list.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/orders/order-list.tsx)
- Uses `DataTable` with columns: Order #, Customer, Items count, Total, Status, Payment, Source, Date, Actions
- Search by order number / customer name
- Filter by status, payment status, source
- Action buttons: View detail, Update status

#### [NEW] [order-detail.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/orders/order-detail.tsx)
- Full order detail card: order info, customer info, items table, totals, timeline
- Status update controls (dropdown to change status)
- Payment status update

#### [NEW] [order-status-update.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/orders/order-status-update.tsx)
- Dialog to update order status and payment status
- Warns when cancelling (stock will be restored)

---

### 10. POS Components

#### [NEW] [pos-product-grid.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/pos/pos-product-grid.tsx)
- Grid of product cards fetched via `useProducts`
- Category filter tabs
- Search input
- Click to add to cart
- Shows price, stock, image placeholder
- Disabled when out of stock

#### [NEW] [pos-cart.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/pos/pos-cart.tsx)
- Cart sidebar/panel listing selected items
- Quantity +/- controls, remove item
- Subtotal per line, grand total
- Customer name/phone inputs
- Notes field
- "Checkout" button opens checkout dialog

#### [NEW] [pos-checkout-dialog.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/components/pos/pos-checkout-dialog.tsx)
- Payment method selector (Cash, Transfer, E-Wallet)
- Order summary
- Confirm button → calls `createOrder` mutation
- On success: clears cart, shows success toast, displays order number

---

### 11. Pages

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/[locale]/(dashboard)/orders/page.tsx)
- Orders list page with PageHeader + Add Order (navigates to POS) + OrderList

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/[locale]/(dashboard)/orders/[id]/page.tsx)
- Order detail page with back button + OrderDetail component

#### [NEW] [page.tsx](file:///c:/Experience/projects/ai-pos-system/ai-pos-system/src/app/[locale]/(dashboard)/pos/page.tsx)
- Full-width POS layout: product grid (left ~60%) + cart (right ~40%)
- Responsive: stacks vertically on mobile

---

## Verification Plan

### Automated Tests
```bash
npm run build
```
- Verify the full project compiles without TypeScript errors

### Manual Verification
- Create an order via POS → verify stock decrements
- Cancel an order → verify stock restores
- Complete an order → verify `completedAt` is set
- View order history → verify filters and search work
- View order detail → verify items and totals display correctly
