'use client'

import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import { FileText, Receipt, Smartphone, Store, User } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import type { Order } from '@/types/order.types'

interface OrderDetailProps {
  order: Order
}

export function OrderDetail({ order }: OrderDetailProps): React.JSX.Element {
  const t = useTranslations('orders')
  const to = useTranslations('orders.status')
  const locale = useLocale() as 'en' | 'id'

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="text-muted-foreground h-5 w-5" />
              {t('detail.items')}
            </CardTitle>
            <div className="text-sm font-medium">{order.items?.length || 0} items</div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('detail.product')}</TableHead>
                    <TableHead className="text-right">{t('detail.price')}</TableHead>
                    <TableHead className="text-center">{t('detail.quantity')}</TableHead>
                    <TableHead className="text-right">{t('detail.total')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-muted-foreground flex justify-end gap-16 text-sm">
                <span>{t('detail.subtotal')}</span>
                <span className="w-24 text-right">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="text-muted-foreground flex justify-end gap-16 text-sm">
                <span>{t('detail.tax')}</span>
                <span className="w-24 text-right">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="text-muted-foreground flex justify-end gap-16 text-sm">
                <span>{t('detail.discount')}</span>
                <span className="w-24 text-right">{formatCurrency(order.discountAmount)}</span>
              </div>
              <Separator className="my-2 ml-auto w-48" />
              <div className="flex justify-end gap-16 font-medium">
                <span>{t('detail.grandTotal')}</span>
                <span className="text-primary w-24 text-right text-lg font-bold">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="text-muted-foreground h-5 w-5" />
                {t('detail.notes')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('detail.orderInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <span className="text-muted-foreground text-sm">{t('orderNumber')}</span>
              <p className="font-mono text-lg font-semibold">{order.orderNumber}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground text-sm">{t('table.date')}</span>
              <p className="font-medium">{formatDate(order.createdAt, 'dd MMM yyyy, HH:mm', locale)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-sm">{t('table.status')}</span>
                <div>
                  <StatusBadge status={order.status} type="order" label={to(order.status)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-sm">{t('table.payment')}</span>
                <div>
                  <StatusBadge status={order.paymentStatus} type="payment" label={to(order.paymentStatus)} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground text-sm">{t('table.source')}</span>
              <div className="flex items-center gap-2 font-medium">
                {order.source === 'WHATSAPP' ? <Smartphone className="h-4 w-4 text-emerald-500" /> : <Store className="h-4 w-4 text-blue-500" />}
                {to(order.source)}
              </div>
            </div>

            {order.paymentMethod && (
              <div className="space-y-1">
                <span className="text-muted-foreground text-sm">{t('status.paymentMethod')}</span>
                <p className="font-medium">{to(order.paymentMethod)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="text-muted-foreground h-5 w-5" />
              {t('detail.customerInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <span className="text-muted-foreground text-sm">Name</span>
              <p className="font-medium">{order.customerName || t('detail.noCustomer')}</p>
            </div>

            {order.customerPhone && (
              <div className="space-y-1">
                <span className="text-muted-foreground text-sm">Phone</span>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
            )}

            {order.customer?.email && (
              <div className="space-y-1">
                <span className="text-muted-foreground text-sm">Email</span>
                <p className="font-medium">{order.customer.email}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
