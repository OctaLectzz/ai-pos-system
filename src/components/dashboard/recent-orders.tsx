'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from '@/i18n/routing'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import { useLocale, useTranslations } from 'next-intl'

const recentOrders = [
  {
    id: 'NX-001',
    customer: 'Walk-in Customer',
    status: 'COMPLETED',
    total: 150000,
    date: '2026-06-04T12:00:00.000Z'
  },
  {
    id: 'NX-002',
    customer: 'John Doe',
    status: 'PROCESSING',
    total: 245000,
    date: '2026-06-04T11:00:00.000Z'
  },
  {
    id: 'NX-003',
    customer: 'Jane Smith',
    status: 'NEW',
    total: 85000,
    date: '2026-06-04T10:00:00.000Z'
  },
  {
    id: 'NX-004',
    customer: 'Walk-in Customer',
    status: 'CANCELLED',
    total: 45000,
    date: '2026-06-03T12:00:00.000Z'
  }
]

export function RecentOrders() {
  const t = useTranslations('dashboard.recentOrders')
  const locale = useLocale() as 'en' | 'id'

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <Badge variant="outline" className="bg-info/10 text-info hover:bg-info/20 border-info/20">
            {status}
          </Badge>
        )
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-success/10 text-success hover:bg-success/20 border-success/20">
            {status}
          </Badge>
        )
      case 'PROCESSING':
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning hover:bg-warning/20 border-warning/20">
            {status}
          </Badge>
        )
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="border-border col-span-full shadow-sm lg:col-span-5">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>{t('title')}</CardTitle>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">{t('viewAll')}</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('columns.orderId')}</TableHead>
                <TableHead>{t('columns.customer')}</TableHead>
                <TableHead>{t('columns.status')}</TableHead>
                <TableHead>{t('columns.date')}</TableHead>
                <TableHead className="text-right">{t('columns.total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDate(order.date, 'dd MMM yyyy, HH:mm', locale)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
