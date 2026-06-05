'use client'

import { ActionButton } from '@/components/shared/action-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/utils/format-currency'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PosCheckoutDialog } from './pos-checkout-dialog'

import type { OrderItem } from '@/types/order.types'
import type { Product } from '@/types/product.types'

interface PosCartProps {
  items: OrderItem[]
  products: Product[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  customerName: string
  setCustomerName: (name: string) => void
  customerPhone: string
  setCustomerPhone: (phone: string) => void
  notes: string
  setNotes: (notes: string) => void
}

export function PosCart({
  items,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes
}: PosCartProps): React.JSX.Element {
  const t = useTranslations('pos')
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)
  const isCartEmpty = items.length === 0

  return (
    <div className="bg-card flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm">
      <div className="bg-muted/30 border-b p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <ShoppingCart className="text-primary h-5 w-5" />
            {t('cart')}
          </h2>
          {!isCartEmpty && (
            <span className="bg-primary/10 text-primary ring-primary/20 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ring-1">
              {items.length}
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {isCartEmpty ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-8 text-center">
            <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
            <p className="font-medium">{t('emptyCart.title')}</p>
            <p className="mt-1 text-sm">{t('emptyCart.description')}</p>
          </div>
        ) : (
          <div className="space-y-6 p-5">
            <div className="space-y-4">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId)
                const isOutOfStock = product ? product.stock <= item.quantity : false

                return (
                  <div
                    key={item.productId}
                    className="group hover:bg-muted/30 hover:border-border/50 -mx-2 flex gap-3 rounded-lg border border-transparent p-2 transition-colors"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="line-clamp-2 text-sm leading-tight font-semibold">{item.productName}</div>
                      <div className="text-primary text-sm font-bold">{formatCurrency(item.unitPrice)}</div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-primary hover:text-primary-foreground hover:border-primary h-7 w-7 rounded-full shadow-sm transition-colors"
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-primary hover:text-primary-foreground hover:border-primary h-7 w-7 rounded-full shadow-sm transition-colors"
                          disabled={isOutOfStock}
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between py-0.5">
                      <ActionButton
                        icon={<Trash2 className="h-4 w-4" />}
                        tooltip={t('remove')}
                        variant="ghost"
                        className="text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => onRemoveItem(item.productId)}
                      />
                      <div className="font-bold tracking-tight">{formatCurrency(item.subtotal)}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">{t('customer.title')}</h3>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="customer-name">{t('customer.name')}</Label>
                  <Input
                    id="customer-name"
                    placeholder={t('customer.namePlaceholder')}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customer-phone">{t('customer.phone')}</Label>
                  <Input
                    id="customer-phone"
                    placeholder={t('customer.phonePlaceholder')}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes">{t('customer.notes')}</Label>
                  <Textarea
                    id="notes"
                    placeholder={t('customer.notesPlaceholder')}
                    className="h-20 resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="bg-card relative z-10 border-t p-5 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-muted-foreground font-semibold">{t('total')}</span>
          <span className="text-primary text-2xl font-bold tracking-tight">{formatCurrency(totalAmount)}</span>
        </div>
        <Button className="w-full text-base font-semibold shadow-md" size="lg" disabled={isCartEmpty} onClick={() => setCheckoutOpen(true)}>
          {t('checkout')}
        </Button>
      </div>

      <PosCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={items}
        customerName={customerName}
        customerPhone={customerPhone}
        notes={notes}
        totalAmount={totalAmount}
        onSuccess={() => {
          onClearCart()
          setCustomerName('')
          setCustomerPhone('')
          setNotes('')
        }}
      />
    </div>
  )
}
