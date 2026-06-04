'use client'

import * as React from 'react'
import { QueryProvider } from './query-provider'
import { SessionProvider } from './session-provider'
import { ThemeProvider } from './theme-provider'
import { ToastProvider } from './toast-provider'

export function Providers({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>
          {children}
          <ToastProvider />
        </SessionProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
