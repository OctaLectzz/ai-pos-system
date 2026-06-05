import { formatCurrency } from '@/utils/format-currency'
import { format } from 'date-fns'

import type { ReceiptData } from '@/types/receipt.types'

/**
 * Generates an HTML string formatted as a thermal receipt.
 * Supports 58mm and 80mm paper widths.
 */
export function generateReceiptHtml(data: ReceiptData): string {
  const { order, store, settings } = data
  const paperWidth = settings?.paperWidth || 80
  const containerWidth = paperWidth === 58 ? '48mm' : '72mm'

  const dateStr = format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')

  let html = `
    <div style="font-family: 'Courier New', monospace; width: ${containerWidth}; font-size: 12px; line-height: 1.4; color: #000; padding: 4mm;">
  `

  // Header text
  if (settings?.headerText) {
    html += `<div style="text-align: center; font-size: 10px; margin-bottom: 4px;">${escapeHtml(settings.headerText)}</div>`
  }

  // Store name
  html += `<div style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 2px;">${escapeHtml(store.name)}</div>`

  // Store address
  if (settings?.showAddress !== false && store.address) {
    html += `<div style="text-align: center; font-size: 10px;">${escapeHtml(store.address)}</div>`
  }

  // Store phone
  if (settings?.showPhone !== false && store.phone) {
    html += `<div style="text-align: center; font-size: 10px;">${escapeHtml(store.phone)}</div>`
  }

  html += `<div style="border-top: 1px dashed #000; margin: 6px 0;"></div>`

  // Order info
  html += `<div style="font-size: 10px;">#${escapeHtml(order.orderNumber)}</div>`
  html += `<div style="font-size: 10px; margin-bottom: 4px;">${dateStr}</div>`

  if (order.customerName) {
    html += `<div style="font-size: 10px;">Customer: ${escapeHtml(order.customerName)}</div>`
  }

  html += `<div style="border-top: 1px dashed #000; margin: 6px 0;"></div>`

  // Items
  for (const item of order.items) {
    html += `
      <div style="margin-bottom: 4px;">
        <div style="font-size: 11px;">${escapeHtml(item.productName)}</div>
        <div style="display: flex; justify-content: space-between; font-size: 10px;">
          <span>${item.quantity} x ${formatCurrency(item.unitPrice)}</span>
          <span>${formatCurrency(item.subtotal)}</span>
        </div>
      </div>
    `
  }

  html += `<div style="border-top: 1px dashed #000; margin: 6px 0;"></div>`

  // Totals
  html += `
    <div style="display: flex; justify-content: space-between; font-size: 10px;">
      <span>Subtotal</span>
      <span>${formatCurrency(order.subtotal)}</span>
    </div>
  `

  if (settings?.showTax !== false && order.taxAmount > 0) {
    html += `
      <div style="display: flex; justify-content: space-between; font-size: 10px;">
        <span>Tax</span>
        <span>${formatCurrency(order.taxAmount)}</span>
      </div>
    `
  }

  if (order.discountAmount > 0) {
    html += `
      <div style="display: flex; justify-content: space-between; font-size: 10px;">
        <span>Discount</span>
        <span>-${formatCurrency(order.discountAmount)}</span>
      </div>
    `
  }

  html += `<div style="border-top: 1px solid #000; margin: 4px 0;"></div>`

  html += `
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px;">
      <span>TOTAL</span>
      <span>${formatCurrency(order.totalAmount)}</span>
    </div>
  `

  html += `<div style="border-top: 1px solid #000; margin: 4px 0;"></div>`

  // Payment method
  if (order.paymentMethod) {
    html += `
      <div style="display: flex; justify-content: space-between; font-size: 10px;">
        <span>Payment</span>
        <span>${escapeHtml(order.paymentMethod)}</span>
      </div>
    `
  }

  // Wi-Fi info
  if (settings?.wifiName) {
    html += `<div style="border-top: 1px dashed #000; margin: 6px 0;"></div>`
    html += `<div style="text-align: center; font-size: 10px;">Wi-Fi: ${escapeHtml(settings.wifiName)}</div>`
    if (settings.wifiPassword) {
      html += `<div style="text-align: center; font-size: 10px;">Pass: ${escapeHtml(settings.wifiPassword)}</div>`
    }
  }

  // Footer text
  if (settings?.footerText) {
    html += `<div style="border-top: 1px dashed #000; margin: 6px 0;"></div>`
    html += `<div style="text-align: center; font-size: 10px;">${escapeHtml(settings.footerText)}</div>`
  }

  html += `</div>`

  return html
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
