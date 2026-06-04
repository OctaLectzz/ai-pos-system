'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Jan', total: 12000000 },
  { name: 'Feb', total: 15000000 },
  { name: 'Mar', total: 18000000 },
  { name: 'Apr', total: 14500000 },
  { name: 'May', total: 21000000 },
  { name: 'Jun', total: 24500000 }
]

export function RevenueChart() {
  const t = useTranslations('dashboard.charts')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="border-border col-span-full shadow-sm lg:col-span-4">
      <CardHeader>
        <CardTitle>{t('revenue')}</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[350px] w-full">
          {mounted ? (
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp ${value / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--card-foreground)',
                    borderRadius: 'var(--radius)'
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: 'var(--primary)' }}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-muted/10 h-full w-full animate-pulse rounded-md" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
