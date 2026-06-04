import { getTranslations } from 'next-intl/server'

import { DashboardSearch } from '@/components/dashboard/dashboard-search'
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
    <div className="mx-auto max-w-7xl flex-1 space-y-6 p-6 pt-8 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">Dashboard</h2>
        <DashboardSearch />
      </div>

      <KpiCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <TopProductsChart />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
        <div className="lg:col-span-5">
          <RecentOrders />
        </div>
        <div className="lg:col-span-3">
          <LowStockAlert />
        </div>
      </div>
    </div>
  )
}
