'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const lowStockItems = [
  { id: 1, name: 'Pizza Dough', stock: 2 },
  { id: 2, name: 'Tomato Sauce', stock: 1 },
  { id: 3, name: 'Cheese', stock: 3 },
  { id: 4, name: 'Chicken Wings', stock: 0 }
]

export function LowStockAlert() {
  const t = useTranslations('dashboard.alerts')

  return (
    <Card className="border-warning/50 bg-warning/5 col-span-full shadow-sm lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-warning flex items-center gap-2">{t('lowStockTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="border-border/50 flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-muted-foreground text-xs">{t('stock', { count: item.stock })}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/products?edit=${item.id}`}>{t('resolve')}</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
