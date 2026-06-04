# Modern UI Redesign Tasks

- `[x]` **Global Styling & Layout Architecture**
  - `[x]` Update `src/app/[locale]/(dashboard)/layout.tsx` with `SidebarProvider` and `SidebarInset`
  - `[x]` Review and tweak color tokens in `globals.css` if necessary
- `[x]` **Sidebar Integration & Redesign**
  - `[x]` Refactor `app-sidebar.tsx` to use shadcn sidebar components
  - `[x]` Group the navigation menu (Main, Inventory, Analytics & Tools, System)
  - `[x]` Update `app-header.tsx` to integrate `SidebarTrigger`
- `[x]` **Dashboard Page & Search**
  - `[x]` Create `dashboard-search.tsx`
  - `[x]` Redesign `dashboard/page.tsx` with modern grid and metric cards
- `[x]` **Components Refinement**
  - `[x]` Enhance `data-table.tsx` (padding, hover states, borders)
  - `[x]` Enlarge `input.tsx`, `textarea.tsx`, `select.tsx` (from `h-8` to `h-10`)
  - `[x]` Add active state indicators to `theme-toggle.tsx`
  - `[x]` Add active state indicators to `language-switcher.tsx`
