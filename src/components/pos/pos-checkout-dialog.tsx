'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useCreateOrder } from '@/hooks/use-orders'
import { formatCurrency } from '@/utils/format-currency'
import { CheckCircle2, Receipt } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import type { OrderItem, PaymentMethod } from '@/types/order.types'

interface PosCheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: OrderItem[]
  customerName: string
  customerPhone: string
  notes: string
  totalAmount: number
  onSuccess: () => void
}

export function PosCheckoutDialog({
  open,
  onOpenChange,
  items,
  customerName,
  customerPhone,
  notes,
  totalAmount,
  onSuccess
}: PosCheckoutDialogProps): React.JSX.Element {
  const t = useTranslations('pos')
  const to = useTranslations('orders')
  const tc = useTranslations('common')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const createOrderMutation = useCreateOrder()

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error(to('validation.items.required'))
      return
    }

    createOrderMutation.mutate(
      {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        source: 'MANUAL'
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            setOrderNumber(response.data.orderNumber)
          }
        }
      }
    )
  }

  const handleClose = () => {
    onOpenChange(false)
    if (orderNumber) {
      setTimeout(() => {
        setOrderNumber(null)
        onSuccess()
      }, 300)
    }
  }

  if (orderNumber) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="mb-2 text-xl">{t('successDialog.title')}</DialogTitle>
            <DialogDescription className="mb-6">{t('successDialog.description')}</DialogDescription>

            <div className="bg-muted w-full rounded-lg p-4">
              <div className="text-muted-foreground mb-1 text-sm">{t('successDialog.orderNumber')}</div>
              <div className="font-mono text-xl font-bold tracking-wider">{orderNumber}</div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleClose} className="w-full">
              {t('successDialog.newOrder')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Receipt className="text-primary h-5 w-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle>{t('checkoutDialog.title')}</DialogTitle>
              <DialogDescription>{t('checkoutDialog.description')}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t('checkoutDialog.summary')}</h4>
            <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('checkoutDialog.totalItems')}</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">{t('checkoutDialog.amount')}</span>
                <span className="text-primary text-lg font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <Field>
            <FieldLabel>{t('checkoutDialog.paymentMethod')}</FieldLabel>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} disabled={createOrderMutation.isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">{to('status.CASH')}</SelectItem>
                <SelectItem value="TRANSFER">{to('status.TRANSFER')}</SelectItem>
                <SelectItem value="E_WALLET">{to('status.E_WALLET')}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createOrderMutation.isPending}>
            {tc('cancel')}
          </Button>
          <Button onClick={handleCheckout} disabled={createOrderMutation.isPending || items.length === 0}>
            {createOrderMutation.isPending ? t('checkoutDialog.processing') : t('checkoutDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
