export interface ReceiptSettings {
  id: string
  storeId: string
  headerText: string | null
  footerText: string | null
  wifiName: string | null
  wifiPassword: string | null
  showLogo: boolean
  showTax: boolean
  showAddress: boolean
  showPhone: boolean
  paperWidth: number
  createdAt: string
  updatedAt: string
}

export interface Printer {
  id: string
  storeId: string
  name: string
  deviceName: string
  type: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ReceiptData {
  order: {
    orderNumber: string
    createdAt: string
    items: Array<{
      productName: string
      quantity: number
      unitPrice: number
      subtotal: number
    }>
    subtotal: number
    taxAmount: number
    discountAmount: number
    totalAmount: number
    paymentMethod: string | null
    paymentStatus: string
    customerName: string | null
    customerPhone: string | null
    source: string
  }
  store: {
    name: string
    address: string | null
    phone: string | null
    email: string | null
  }
  settings: ReceiptSettings | null
}

export type PrinterType = 'THERMAL' | 'LABEL'

export type PaperWidth = 58 | 80
