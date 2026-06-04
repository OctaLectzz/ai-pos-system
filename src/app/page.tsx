import { getTranslations } from 'next-intl/server'
import * as React from 'react'

export default async function HomePage(): Promise<React.JSX.Element> {
  const t = await getTranslations()

  return (
    <div className="bg-background flex flex-1 flex-col items-center justify-center p-6 text-center select-none">
      <main className="max-w-md space-y-6">
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">{t('app.name')}</h1>
        <p className="text-muted-foreground text-xl">{t('app.tagline')}</p>
        <div className="flex justify-center gap-4">
          <span className="bg-secondary/10 text-secondary-foreground ring-secondary/25 inline-flex items-center rounded-md px-3.5 py-1 text-sm font-medium ring-1 ring-inset">
            {t('common.success')}
          </span>
        </div>
      </main>
    </div>
  )
}
