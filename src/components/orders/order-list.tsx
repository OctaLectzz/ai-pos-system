'use client'

import { DataTable, type DataTableColumn } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import { Eye, Smartphone, Store } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

import { useOrders } from '@/hooks/use-orders'
import type { Order, OrderSource, OrderStatus, PaymentStatus } from '@/types/order.types'

export function OrderList(): React.JSX.Element {
  const t = useTranslations('orders')
  const to = useTranslations('orders.status')
  const locale = useLocale() as 'en' | 'id'
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 500)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL')
  const [sourceFilter, setSourceFilter] = useState<OrderSource | 'ALL'>('ALL')

  const { data, isLoading } = useOrders({
    search: debouncedSearch || undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    paymentStatus: paymentFilter !== 'ALL' ? paymentFilter : undefined,
    source: sourceFilter !== 'ALL' ? sourceFilter : undefined,
    pageSize: 50 // Fetch enough for now since we don't have pagination UI yet
  })

  const orders = data?.data || []

  const columns: DataTableColumn<Order>[] = [
    {
      key: 'orderNumber',
      header: t('table.orderNumber'),
      render: (order) => <span className="font-mono font-medium">{order.orderNumber}</span>
    },
    {
      key: 'date',
      header: t('table.date'),
      render: (order) => <span className="text-muted-foreground text-sm">{formatDate(order.createdAt, 'dd MMM yyyy, HH:mm', locale)}</span>
    },
    {
      key: 'customer',
      header: t('table.customer'),
      render: (order) => (
        <div className="flex flex-col">
          <span className="font-medium">{order.customerName || t('detail.noCustomer')}</span>
          {order.customerPhone && <span className="text-muted-foreground text-xs">{order.customerPhone}</span>}
        </div>
      )
    },
    {
      key: 'source',
      header: t('table.source'),
      render: (order) => (
        <div className="text-muted-foreground flex items-center gap-1.5">
          {order.source === 'WHATSAPP' ? <Smartphone className="h-4 w-4" /> : <Store className="h-4 w-4" />}
          <span className="text-xs">{to(order.source)}</span>
        </div>
      )
    },
    {
      key: 'total',
      header: t('table.total'),
      render: (order) => <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
    },
    {
      key: 'status',
      header: t('table.status'),
      render: (order) => <StatusBadge status={order.status} type="order" label={to(order.status)} />
    },
    {
      key: 'payment',
      header: t('table.payment'),
      render: (order) => <StatusBadge status={order.paymentStatus} type="payment" label={to(order.paymentStatus)} />
    },
    {
      key: 'actions',
      header: t('table.actions'),
      className: 'text-right',
      render: (order) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/orders/${order.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('orderDetail')}
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as OrderStatus | 'ALL')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('filter.allStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('filter.allStatus')}</SelectItem>
              <SelectItem value="NEW">{to('NEW')}</SelectItem>
              <SelectItem value="CONFIRMED">{to('CONFIRMED')}</SelectItem>
              <SelectItem value="PROCESSING">{to('PROCESSING')}</SelectItem>
              <SelectItem value="COMPLETED">{to('COMPLETED')}</SelectItem>
              <SelectItem value="CANCELLED">{to('CANCELLED')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={(val) => setPaymentFilter(val as PaymentStatus | 'ALL')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('filter.allPayment')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('filter.allPayment')}</SelectItem>
              <SelectItem value="PENDING">{to('PENDING')}</SelectItem>
              <SelectItem value="PAID">{to('PAID')}</SelectItem>
              <SelectItem value="PARTIAL">{to('PARTIAL')}</SelectItem>
              <SelectItem value="REFUNDED">{to('REFUNDED')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={(val) => setSourceFilter(val as OrderSource | 'ALL')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('filter.allSource')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t('filter.allSource')}</SelectItem>
              <SelectItem value="MANUAL">{to('MANUAL')}</SelectItem>
              <SelectItem value="WHATSAPP">{to('WHATSAPP')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyState={
          <div className="text-muted-foreground bg-card flex flex-col items-center justify-center rounded-xl border p-12 text-center">
            <Store className="mb-4 h-12 w-12 opacity-20" />
            <p className="font-medium">{t('empty.title')}</p>
            <p className="mt-1 text-sm">{t('empty.description')}</p>
          </div>
        }
      />
    </div>
  )
}
