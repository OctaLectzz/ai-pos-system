import { z } from 'zod'

export const createOrderItemSchema = z.object({
  productId: z.string().min(1, 'orders.validation.productId.required'),
  quantity: z.coerce.number().int().positive('orders.validation.quantity.positive')
})

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, 'orders.validation.items.required'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'E_WALLET']).optional(),
  customerName: z.string().max(100, 'orders.validation.customerName.maxLength').optional().or(z.literal('')),
  customerPhone: z.string().max(20, 'orders.validation.customerPhone.maxLength').optional().or(z.literal('')),
  notes: z.string().max(500, 'orders.validation.notes.maxLength').optional().or(z.literal('')),
  source: z.enum(['WHATSAPP', 'MANUAL']).default('MANUAL')
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const updateOrderStatusSchema = z.object({
  status: z.enum(['NEW', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED']).optional(),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'E_WALLET']).optional()
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
