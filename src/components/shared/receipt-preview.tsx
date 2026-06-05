'use client'

import { ReceiptTicket } from '@/components/shared/receipt-ticket'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePrinters } from '@/hooks/use-printers'
import { useReceiptSettings } from '@/hooks/use-receipt-settings'
import { printReceipt } from '@/services/print-service'
import { generateReceiptHtml } from '@/utils/generate-receipt-html'
import { AlertTriangle, Printer, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import type { Order } from '@/types/order.types'
import type { ReceiptData } from '@/types/receipt.types'

interface ReceiptPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order
  storeName?: string
  storeAddress?: string | null
  storePhone?: string | null
  storeEmail?: string | null
}

export function ReceiptPreview({
  open,
  onOpenChange,
  order,
  storeName = 'NexPOS',
  storeAddress = null,
  storePhone = null,
  storeEmail = null
}: ReceiptPreviewProps): React.JSX.Element {
  const t = useTranslations('receipt.preview')
  const { data: settingsData } = useReceiptSettings()
  const { data: printersData } = usePrinters()
  const [isPrinting, setIsPrinting] = useState(false)

  const settings = settingsData?.data ?? null
  const defaultPrinter = printersData?.data?.find((p) => p.isDefault && p.isActive)

  const receiptData: ReceiptData = useMemo(
    () => ({
      order: {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        items: (order.items || []).map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          subtotal: Number(item.subtotal)
        })),
        subtotal: Number(order.subtotal),
        taxAmount: Number(order.taxAmount),
        discountAmount: Number(order.discountAmount),
        totalAmount: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        source: order.source
      },
      store: {
        name: storeName,
        address: storeAddress,
        phone: storePhone,
        email: storeEmail
      },
      settings
    }),
    [order, storeName, storeAddress, storePhone, storeEmail, settings]
  )

  const handlePrint = useCallback(async () => {
    setIsPrinting(true)
    try {
      const html = generateReceiptHtml(receiptData)
      await printReceipt(html, defaultPrinter?.deviceName)
    } finally {
      setIsPrinting(false)
    }
  }, [receiptData, defaultPrinter])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Printer className="text-primary h-5 w-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description')}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {/* Receipt visual preview */}
          <ReceiptTicket
            order={order}
            settings={settings}
            storeName={storeName}
            storeAddress={storeAddress}
            storePhone={storePhone}
            storeEmail={storeEmail}
          />
        </ScrollArea>

        {/* No printer warning */}
        {!defaultPrinter && (
          <div className="bg-warning/10 text-warning flex items-center gap-2 rounded-lg p-3 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{t('noPrinter')}</span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            {t('close')}
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? t('printing') : t('print')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
