import { Providers } from '@/providers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import * as React from 'react'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin']
})

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'NexPOS',
  description: 'AI-Powered Omnichannel POS System'
}

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Providers>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
