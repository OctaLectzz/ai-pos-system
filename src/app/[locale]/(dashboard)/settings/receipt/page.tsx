'use client'

import { ReceiptSettingsForm } from '@/components/settings/receipt-settings-form'
import { PageHeader } from '@/components/shared/page-header'
import { ReceiptTicket } from '@/components/shared/receipt-ticket'
import { useReceiptSettings } from '@/hooks/use-receipt-settings'
import { Receipt } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { ReceiptSettingsInput } from '@/schemas/receipt.schema'
import type { Order } from '@/types/order.types'
import type { ReceiptSettings } from '@/types/receipt.types'

export default function ReceiptSettingsPage(): React.JSX.Element {
  const t = useTranslations('receipt.settings')
  const tp = useTranslations('receipt.preview')
  const { data: settingsData } = useReceiptSettings()
  const [liveSettings, setLiveSettings] = useState<Partial<ReceiptSettingsInput>>({})

  const savedSettings = settingsData?.data || null

  // Merge saved settings with live form changes
  const settings = savedSettings ? { ...savedSettings, ...liveSettings } : (liveSettings as unknown as ReceiptSettings)

  const dummyOrder: Order = {
    id: 'dummy',
    storeId: 'store-1',
    customerId: null,
    orderNumber: 'INV-DEMO-123',
    subtotal: 150000,
    taxAmount: 15000,
    discountAmount: 0,
    totalAmount: 165000,
    status: 'COMPLETED',
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    source: 'MANUAL',
    customerName: 'Demo Customer',
    customerPhone: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    items: [
      {
        id: 'item1',
        orderId: 'dummy',
        productId: 'prod1',
        productName: 'Sample Product 1',
        quantity: 2,
        unitPrice: 50000,
        subtotal: 100000
      },
      {
        id: 'item2',
        orderId: 'dummy',
        productId: 'prod2',
        productName: 'Sample Product 2',
        quantity: 1,
        unitPrice: 50000,
        subtotal: 50000
      },
      {
        id: 'item3',
        orderId: 'dummy',
        productId: 'prod3',
        productName: 'Sample Product 3',
        quantity: 1,
        unitPrice: 50000,
        subtotal: 50000
      },
      {
        id: 'item4',
        orderId: 'dummy',
        productId: 'prod4',
        productName: 'Sample Product 4',
        quantity: 10,
        unitPrice: 10000,
        subtotal: 100000
      },
      {
        id: 'item5',
        orderId: 'dummy',
        productId: 'prod5',
        productName: 'Sample Product 5',
        quantity: 2,
        unitPrice: 25000,
        subtotal: 50000
      }
    ]
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <PageHeader title={t('title')}>
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <Receipt className="text-primary h-5 w-5" />
        </div>
      </PageHeader>

      <p className="text-muted-foreground text-sm">{t('description')}</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <ReceiptSettingsForm onChange={setLiveSettings} />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">{tp('title')}</h3>
          <div className="rounded-xl border bg-slate-50/50 p-4 dark:bg-slate-900/50">
            <ReceiptTicket order={dummyOrder} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  )
}
