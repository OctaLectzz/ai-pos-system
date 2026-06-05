'use client'

import { OrderList } from '@/components/orders/order-list'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function OrdersPage(): React.JSX.Element {
  const t = useTranslations('orders')
  const locale = useLocale() as 'en' | 'id'
  const router = useRouter()

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <PageHeader title={t('title')} description={t('description')}>
        <Button onClick={() => router.push(`/${locale}/pos`)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('newOrder')}
        </Button>
      </PageHeader>

      <OrderList />
    </div>
  )
}
