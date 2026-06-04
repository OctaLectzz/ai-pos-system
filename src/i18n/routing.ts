import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Supported locales
  locales: ['id', 'en'],

  // Default locale
  defaultLocale: 'id',

  // Use clean URLs without /id or /en prefixes
  localePrefix: 'never'
})

// Navigation utilities wrapped with locale awareness
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
