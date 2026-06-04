import * as React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-lg">{children}</div>
    </div>
  )
}
