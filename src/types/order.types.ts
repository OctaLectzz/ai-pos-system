export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED'
export type PaymentMethod = 'CASH' | 'TRANSFER' | 'E_WALLET'
export type OrderSource = 'WHATSAPP' | 'MANUAL'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  notes: string | null
}

export interface Order {
  id: string
  storeId: string
  customerId: string | null
  orderNumber: string
  status: OrderStatus
  source: OrderSource
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: PaymentMethod | null
  paymentStatus: PaymentStatus
  notes: string | null
  customerName: string | null
  customerPhone: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null

  // Relations
  items?: OrderItem[]
  customer?: Customer | null
}

export interface OrderListParams {
  search?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  source?: OrderSource
  page?: number
  pageSize?: number
  dateFrom?: string
  dateTo?: string
}
