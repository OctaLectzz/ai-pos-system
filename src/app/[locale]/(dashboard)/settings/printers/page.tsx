'use client'

import { PrinterList } from '@/components/settings/printer-list'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { BookOpen, Printer } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function PrinterManagementPage(): React.JSX.Element {
  const t = useTranslations('receipt.printers')

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <PageHeader title={t('title')}>
        <Button variant="outline" asChild>
          <Link href="/settings/printers/guide">
            <BookOpen className="mr-2 h-4 w-4" />
            {t('guide')}
          </Link>
        </Button>
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <Printer className="text-primary h-5 w-5" />
        </div>
      </PageHeader>

      <p className="text-muted-foreground text-sm">{t('description')}</p>

      <PrinterList />
    </div>
  )
}
