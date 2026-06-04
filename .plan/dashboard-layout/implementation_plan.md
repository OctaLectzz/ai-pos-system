# Phase 3: Dashboard Layout

This plan covers the implementation of the main dashboard layout, navigation sidebar, header, and the dashboard home page with KPI cards and static components.

## Proposed Changes

### Dashboard Layout & Navigation

#### [NEW] `src/app/[locale]/(dashboard)/layout.tsx`
- Dashboard layout component.
- Integrates `AppSidebar` and `AppHeader`.
- Handles main content area.

#### [NEW] `src/components/shared/app-sidebar.tsx`
- Role-based sidebar navigation.
- Links to Home, Products, Categories, Orders, POS, Reports, AI, WA, Settings.
- Responsive handling (mobile vs desktop).

#### [NEW] `src/components/shared/app-header.tsx`
- Header with search, theme toggle, language switcher, user avatar.

#### [NEW] `src/components/shared/theme-toggle.tsx`
- Component to switch between light and dark themes using `next-themes`.

#### [NEW] `src/components/shared/language-switcher.tsx`
- Component to switch between languages using `next-intl`.

### Dashboard Home Page

#### [NEW] `src/app/[locale]/(dashboard)/dashboard/page.tsx`
- Main dashboard page.
- Layout for KPI cards, revenue chart, top products, recent orders, and low-stock alerts.

#### [NEW] `src/components/dashboard/kpi-cards.tsx`
- KPI cards for Revenue, Orders, Products, Low Stock.

#### [NEW] `src/components/dashboard/revenue-chart.tsx`
- Line chart using Recharts for revenue overview.

#### [NEW] `src/components/dashboard/top-products-chart.tsx`
- Bar chart using Recharts for top products.

#### [NEW] `src/components/dashboard/recent-orders.tsx`
- Table for recent orders using shadcn/ui.

#### [NEW] `src/components/dashboard/low-stock-alert.tsx`
- Warning list for low-stock products.

### Translations
#### [NEW/MODIFY] `src/messages/en/dashboard.json` & `src/messages/id/dashboard.json`
- Add necessary translation strings for the dashboard components.

## Design Constraints
- **Colors**: Strictly apply predefined Tailwind CSS variables for Deep Navy Blue (`bg-primary`), Teal (`bg-secondary`), and Warm Amber (`bg-accent`).
- **NO HARDCODED HEX COLORS**. Use Tailwind classes like `text-primary`, `bg-secondary`, `bg-background`, `bg-card`, etc.
- **Icons**: Use `lucide-react`.

## User Review Required

Please review this implementation plan. If approved, I will proceed with creating the components according to the defined specifications in DESIGN.md and TASK_INSTRUCTION.md.
