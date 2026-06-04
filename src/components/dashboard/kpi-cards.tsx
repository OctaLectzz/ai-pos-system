'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency'
import { AlertTriangle, DollarSign, Package, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function KpiCards() {
  const t = useTranslations('dashboard.kpi')

  const kpis = [
    {
      title: t('totalRevenue'),
      value: formatCurrency(24500000),
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10'
    },
    {
      title: t('totalOrders'),
      value: '845',
      icon: ShoppingCart,
      trend: '+5.2%',
      trendUp: true,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10'
    },
    {
      title: t('totalProducts'),
      value: '142',
      icon: Package,
      trend: '+2',
      trendUp: true,
      iconColor: 'text-info',
      iconBg: 'bg-info/10'
    },
    {
      title: t('lowStock'),
      value: '12',
      icon: AlertTriangle,
      trend: '-3',
      trendUp: false,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${kpi.iconBg}`}>
                <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                <span className={kpi.trendUp ? 'text-success' : 'text-destructive'}>{kpi.trend}</span> {t('fromLastMonth')}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
