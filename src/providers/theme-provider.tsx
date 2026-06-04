'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>): React.JSX.Element {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalError = console.error
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) return
      originalError.apply(console, args)
    }
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
