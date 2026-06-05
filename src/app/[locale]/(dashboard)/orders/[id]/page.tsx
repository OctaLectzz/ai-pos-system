'use client'

import { OrderDetail } from '@/components/orders/order-detail'
import { OrderStatusUpdate } from '@/components/orders/order-status-update'
import { ActionButton } from '@/components/shared/action-button'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrder } from '@/hooks/use-orders'
import { ArrowLeft, Edit } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }): React.JSX.Element {
  const t = useTranslations('orders')
  const tc = useTranslations('common')
  const locale = useLocale() as 'en' | 'id'
  const router = useRouter()

  // Unwrap params using React.use
  const resolvedParams = use(params)
  const { id } = resolvedParams

  const [statusOpen, setStatusOpen] = useState(false)
  const { data, isLoading, error } = useOrder(id)

  const order = data?.data

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-[400px] rounded-xl lg:col-span-2" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">{tc('error')}</h2>
        <p className="text-muted-foreground mb-6">Failed to load order details.</p>
        <ActionButton
          icon={<ArrowLeft className="h-4 w-4" />}
          tooltip={tc('back')}
          onClick={() => router.push(`/${locale}/orders`)}
          variant="outline"
          className="w-auto px-4"
        >
          {tc('back')}
        </ActionButton>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <ActionButton
          icon={<ArrowLeft className="h-4 w-4" />}
          tooltip={tc('back')}
          variant="outline"
          className="border-muted-foreground/20 hover:bg-muted/50 rounded-full"
          onClick={() => router.push(`/${locale}/orders`)}
        />
        <PageHeader title={`${t('orderDetail')} - ${order.orderNumber}`} className="flex-1">
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip={t('status.title')}
            variant="outline"
            className="w-auto px-4"
            onClick={() => setStatusOpen(true)}
          >
            {t('status.title')}
          </ActionButton>
        </PageHeader>
      </div>

      <OrderDetail order={order} />

      <OrderStatusUpdate order={order} open={statusOpen} onOpenChange={setStatusOpen} />
    </div>
  )
}
