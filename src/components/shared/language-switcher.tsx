'use client'

import { usePathname, useRouter } from '@/i18n/routing'
import { Check, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: 'en' | 'id') => {
    if (newLocale === locale) return
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => switchLanguage('id')}
          className={cn('flex cursor-pointer items-center justify-between', locale === 'id' && 'bg-muted font-medium')}
        >
          Indonesia
          {locale === 'id' && <Check className="text-primary h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage('en')}
          className={cn('flex cursor-pointer items-center justify-between', locale === 'en' && 'bg-muted font-medium')}
        >
          English
          {locale === 'en' && <Check className="text-primary h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
