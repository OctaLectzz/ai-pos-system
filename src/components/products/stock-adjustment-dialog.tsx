'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAdjustStock } from '@/hooks/use-products'
import { StockAdjustmentInput, stockAdjustmentSchema } from '@/schemas/product.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'

import type { Product } from '@/types/product.types'

interface StockAdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function StockAdjustmentDialog({ open, onOpenChange, product }: StockAdjustmentDialogProps): React.JSX.Element {
  const t = useTranslations('products')
  const tc = useTranslations('common')

  const adjustMutation = useAdjustStock()
  const isLoading = adjustMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<StockAdjustmentInput>({
    resolver: zodResolver(stockAdjustmentSchema) as Resolver<StockAdjustmentInput>,
    defaultValues: {
      adjustment: 0,
      reason: ''
    }
  })

  useEffect(() => {
    if (open) {
      reset({ adjustment: 0, reason: '' })
    }
  }, [open, reset])

  function onSubmit(values: StockAdjustmentInput): void {
    if (!product) return
    adjustMutation.mutate(
      { id: product.id, data: values },
      {
        onSuccess: (response) => {
          if (response.success) {
            onOpenChange(false)
          }
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('stock.title')}</DialogTitle>
          <DialogDescription>{t('stock.description')}</DialogDescription>
        </DialogHeader>

        {product && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-muted-foreground text-sm">
              {t('stock.currentStock')}:{' '}
              <span className="font-semibold">
                {product.stock} {product.unit}
              </span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="adjustment">{t('stock.adjustment')}</FieldLabel>
              <Input id="adjustment" type="number" placeholder={t('stock.adjustmentPlaceholder')} {...register('adjustment')} disabled={isLoading} />
              <FieldError errors={[errors.adjustment]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="reason">{t('stock.reason')}</FieldLabel>
              <Input id="reason" placeholder={t('stock.reasonPlaceholder')} {...register('reason')} disabled={isLoading} />
              <FieldError errors={[errors.reason]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {tc('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('stock.saving') : t('stock.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
