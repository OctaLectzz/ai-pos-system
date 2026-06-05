import { formatCurrency } from '@/utils/format-currency'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'

import type { Order } from '@/types/order.types'
import type { ReceiptSettings } from '@/types/receipt.types'

interface ReceiptTicketProps {
  order: Order
  settings: ReceiptSettings | null
  storeName?: string
  storeAddress?: string | null
  storePhone?: string | null
  storeEmail?: string | null
}

export function ReceiptTicket({
  order,
  settings,
  storeName = 'NexPOS',
  storeAddress = null,
  storePhone = null
}: ReceiptTicketProps): React.JSX.Element {
  const t = useTranslations('receipt.preview')
  const dateStr = format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')

  return (
    <div className="mx-auto my-4 w-full max-w-[320px] rounded-lg border bg-white p-6 font-mono text-xs text-black shadow-inner dark:bg-white">
      {/* Store header */}
      {settings?.headerText && <div className="mb-1 text-center text-[10px] whitespace-pre-wrap text-gray-500">{settings.headerText}</div>}
      <div className="text-center text-sm font-bold">{storeName}</div>
      {settings?.showAddress !== false && storeAddress && <div className="text-center text-[10px] text-gray-600">{storeAddress}</div>}
      {settings?.showPhone !== false && storePhone && <div className="text-center text-[10px] text-gray-600">{storePhone}</div>}

      <div className="my-2 border-t border-dashed border-gray-400" />

      {/* Order info */}
      <div className="text-[10px] text-gray-600">#{order.orderNumber}</div>
      <div className="mb-1 text-[10px] text-gray-600">{dateStr}</div>
      {order.customerName && (
        <div className="text-[10px]">
          {t('customer')}: {order.customerName}
        </div>
      )}

      <div className="my-2 border-t border-dashed border-gray-400" />

      {/* Items */}
      <div className="space-y-1.5">
        {order.items?.map((item) => (
          <div key={item.id}>
            <div className="text-[11px] font-medium">{item.productName}</div>
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>
                {item.quantity} x {formatCurrency(item.unitPrice)}
              </span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-2 border-t border-dashed border-gray-400" />

      {/* Totals */}
      <div className="space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span>{t('subtotal')}</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {settings?.showTax !== false && Number(order.taxAmount) > 0 && (
          <div className="flex justify-between">
            <span>{t('tax')}</span>
            <span>{formatCurrency(order.taxAmount)}</span>
          </div>
        )}
        {Number(order.discountAmount) > 0 && (
          <div className="flex justify-between">
            <span>{t('discount')}</span>
            <span>-{formatCurrency(order.discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="my-1 border-t border-gray-800" />

      <div className="flex justify-between text-sm font-bold">
        <span>{t('total')}</span>
        <span>{formatCurrency(order.totalAmount)}</span>
      </div>

      <div className="my-1 border-t border-gray-800" />

      {order.paymentMethod && (
        <div className="flex justify-between text-[10px]">
          <span>{t('payment')}</span>
          <span>{order.paymentMethod}</span>
        </div>
      )}

      {/* Wi-Fi */}
      {settings?.wifiName && (
        <>
          <div className="my-2 border-t border-dashed border-gray-400" />
          <div className="text-center text-[10px]">
            {t('wifi')}: {settings.wifiName}
          </div>
          {settings.wifiPassword && (
            <div className="text-center text-[10px]">
              {t('password')}: {settings.wifiPassword}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      {settings?.footerText && (
        <>
          <div className="my-2 border-t border-dashed border-gray-400" />
          <div className="text-center text-[10px] whitespace-pre-wrap text-gray-500">{settings.footerText}</div>
        </>
      )}
    </div>
  )
}
