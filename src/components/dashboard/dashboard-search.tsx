'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Input } from '@/components/ui/input'

export function DashboardSearch() {
  const t = useTranslations('dashboard.header')
  const [query, setQuery] = useState('')

  return (
    <div className="relative w-full max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder={t('search') || 'Search anything...'}
        className="border-muted-foreground/20 bg-card hover:border-primary/30 focus-visible:ring-primary/20 h-10 w-full rounded-full pl-10 text-sm shadow-sm transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
