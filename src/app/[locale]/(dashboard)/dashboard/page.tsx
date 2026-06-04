import { getTranslations } from 'next-intl/server'

import { KpiCards } from '@/components/dashboard/kpi-cards'
import { LowStockAlert } from '@/components/dashboard/low-stock-alert'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { TopProductsChart } from '@/components/dashboard/top-products-chart'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  return {
    title: `${t('title')} | NexPOS`
  }
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <KpiCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart />
        <TopProductsChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <RecentOrders />
        <LowStockAlert />
      </div>
    </div>
  )
}
