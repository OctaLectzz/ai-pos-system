'use client'

import { FormDialog } from '@/components/shared/form-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateOrderStatus } from '@/hooks/use-orders'
import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from '@/types/order.types'

interface OrderStatusUpdateProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderStatusUpdate({ order, open, onOpenChange }: OrderStatusUpdateProps): React.JSX.Element {
  const t = useTranslations('orders')
  const to = useTranslations('orders.status')
  const tc = useTranslations('common')

  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(order.paymentMethod || '')

  const updateMutation = useUpdateOrderStatus()

  // Reset state when order changes
  useEffect(() => {
    if (open) {
      setStatus(order.status)
      setPaymentStatus(order.paymentStatus)
      setPaymentMethod(order.paymentMethod || '')
    }
  }, [order, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateMutation.mutate(
      {
        id: order.id,
        data: {
          status,
          paymentStatus,
          paymentMethod: paymentMethod || undefined
        }
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            onOpenChange(false)
          }
        }
      }
    )
  }

  const isCancelling = status === 'CANCELLED' && order.status !== 'CANCELLED'

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('status.title')}
      description={t('status.description')}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      cancelLabel={tc('cancel')}
      submitLabel={tc('save')}
      submitLoadingLabel={tc('loading')}
    >
      <div className="space-y-5">
        <Field>
          <FieldLabel>{t('status.orderStatus')}</FieldLabel>
          <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">{to('NEW')}</SelectItem>
              <SelectItem value="CONFIRMED">{to('CONFIRMED')}</SelectItem>
              <SelectItem value="PROCESSING">{to('PROCESSING')}</SelectItem>
              <SelectItem value="COMPLETED">{to('COMPLETED')}</SelectItem>
              <SelectItem value="CANCELLED">{to('CANCELLED')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {isCancelling && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">{t('warning.cancelOrder')}</AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel>{t('status.paymentStatus')}</FieldLabel>
          <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">{to('PENDING')}</SelectItem>
              <SelectItem value="PAID">{to('PAID')}</SelectItem>
              <SelectItem value="PARTIAL">{to('PARTIAL')}</SelectItem>
              <SelectItem value="REFUNDED">{to('REFUNDED')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>{t('status.paymentMethod')}</FieldLabel>
          <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
            <SelectTrigger>
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">{to('CASH')}</SelectItem>
              <SelectItem value="TRANSFER">{to('TRANSFER')}</SelectItem>
              <SelectItem value="E_WALLET">{to('E_WALLET')}</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>Required if payment is completed</FieldDescription>
        </Field>
      </div>
    </FormDialog>
  )
}
