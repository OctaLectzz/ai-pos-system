'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Burger', sales: 8500000 },
  { name: 'Pizza', sales: 6200000 },
  { name: 'Coffee', sales: 4100000 },
  { name: 'Fries', sales: 2800000 },
  { name: 'Soda', sales: 1500000 }
]

export function TopProductsChart() {
  const t = useTranslations('dashboard.charts')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="border-border col-span-full shadow-sm lg:col-span-3">
      <CardHeader>
        <CardTitle>{t('topProducts')}</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[350px] w-full">
          {mounted ? (
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp ${value / 1000000}M`}
                />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--card-foreground)',
                    borderRadius: 'var(--radius)'
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Sales']}
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="sales" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-muted/10 h-full w-full animate-pulse rounded-md" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
