# Modern UI Redesign Implementation Plan

This plan outlines the steps to comprehensively redesign the NexPOS interface to be modern, elegant, user-friendly, and fully supportive of both dark and light modes, as requested.

## User Review Required

> [!IMPORTANT]
> This redesign touches core layout structures and global styling. Please review the proposed changes below, especially the new grouping for the Sidebar menus and the overall layout structure.

## Proposed Changes

### 1. Global Styling & Layout Architecture

#### [MODIFY] `src/app/[locale]/(dashboard)/layout.tsx`
- Replace the current custom flex layout with shadcn's standard `SidebarProvider` and `SidebarInset`.
- This provides a much smoother, animated, and accessible layout experience across all screen sizes.

#### [MODIFY] `src/app/globals.css`
- Ensure the color tokens (currently using `oklch`) are perfectly tuned for high contrast, modern elegance, and a premium feel in both dark and light modes.
- Enhance global border-radius logic if needed for a softer, more modern look.

---

### 2. Sidebar Integration & Redesign

#### [MODIFY] `src/components/shared/app-sidebar.tsx`
- Refactor the component to use the newly installed `src/components/ui/sidebar.tsx` components (`Sidebar`, `SidebarContent`, `SidebarGroup`, `SidebarMenu`, etc.).
- **Group the navigation menu** into logical sections:
  - **Main**: Dashboard, POS, Orders
  - **Inventory**: Products, Categories
  - **Analytics & Tools**: Reports, AI Assistant, WhatsApp
  - **System**: Settings

#### [MODIFY] `src/components/shared/app-header.tsx`
- Integrate with the new `SidebarTrigger` so the mobile and desktop collapse behaviors are unified.
- Enhance the header's styling (e.g., subtle backdrop blur, refined borders).

---

### 3. Dashboard Page & Search

#### [MODIFY] `src/app/[locale]/(dashboard)/dashboard/page.tsx`
- Redesign the dashboard with a clean, modern grid layout.
- Introduce metric cards with subtle gradients, icons, and micro-animations on hover.

#### [NEW] `src/components/shared/dashboard-search.tsx`
- Create a dedicated, prominent search component for the dashboard area to easily find products, orders, or actions.

---

### 4. Components Refinement

#### [MODIFY] `src/components/shared/data-table.tsx`
- Enhance table appearance: increase cell padding, add subtle row hover states (`hover:bg-muted/50`), refine header typography (uppercase, muted foreground), and improve border styling.
- Add a clean empty state design.

#### [MODIFY] `src/components/ui/input.tsx` (and `textarea.tsx`, `select.tsx`)
- Increase default sizing from `h-8` to `h-10` to make them larger, more clickable, and user-friendly.
- Increase padding and adjust text size accordingly.

#### [MODIFY] `src/components/shared/theme-toggle.tsx`
- Add a clear visual indicator (e.g., a checkmark icon or a primary background tint) to the currently active theme in the dropdown menu.

#### [MODIFY] `src/components/shared/language-switcher.tsx`
- Add the same active state visual indicator to the selected language.

## Verification Plan

### Manual Verification
- Test layout responsiveness on mobile, tablet, and desktop viewports.
- Toggle between Light and Dark mode to ensure colors, borders, and shadows maintain a premium aesthetic.
- Verify that the new sidebar groups are logical and the collapse/expand animations are smooth.
- Verify that inputs are noticeably larger and easier to interact with.
- Ensure the active state for language/theme is visually distinct.
