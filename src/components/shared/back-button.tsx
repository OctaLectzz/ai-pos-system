'use client'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import * as React from 'react'

interface BackButtonProps extends Omit<React.ComponentProps<typeof Button>, 'asChild'> {
  href?: string
  fallbackHref?: string
  label?: string
}

export function BackButton({
  href,
  fallbackHref,
  label,
  className,
  variant = 'outline',
  size = 'default',
  onClick,
  ...props
}: BackButtonProps): React.JSX.Element {
  const t = useTranslations('common')
  const router = useRouter()

  const defaultLabel = label || t('back')

  if (href) {
    return (
      <Button variant={variant} size={size} className={cn('gap-2', className)} asChild {...props}>
        <Link href={href}>
          <ArrowLeft className="h-4 w-4" />
          {defaultLabel}
        </Link>
      </Button>
    )
  }

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e)

    if (fallbackHref) {
      if (window.history.length > 2) {
        router.back()
      } else {
        router.push(fallbackHref)
      }
    } else {
      router.back()
    }
  }

  return (
    <Button variant={variant} size={size} className={cn('gap-2', className)} onClick={handleBack} {...props}>
      <ArrowLeft className="h-4 w-4" />
      {defaultLabel}
    </Button>
  )
}
