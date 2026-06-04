import { z } from 'zod'

export const productBaseSchema = z.object({
  name: z.string().min(2, 'products.validation.name.minLength').max(200, 'products.validation.name.maxLength'),
  categoryId: z.string().min(1, 'products.validation.categoryId.required'),
  sku: z.string().optional().or(z.literal('')),
  description: z.string().max(1000, 'products.validation.description.maxLength').optional().or(z.literal('')),
  price: z.coerce.number().positive('products.validation.price.positive'),
  discountPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  costPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  stock: z.coerce.number().int().min(0, 'products.validation.stock.min'),
  minStockThreshold: z.coerce.number().int().min(0),
  unit: z.string().min(1),
  weight: z.coerce.number().min(0).optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'])
})

export const createProductSchema = productBaseSchema.extend({
  stock: z.coerce.number().int().min(0, 'products.validation.stock.min').default(0),
  minStockThreshold: z.coerce.number().int().min(0).default(5),
  unit: z.string().min(1).default('pcs'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE')
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export const updateProductSchema = productBaseSchema.partial()

export type UpdateProductInput = z.infer<typeof updateProductSchema>

export const stockAdjustmentSchema = z.object({
  adjustment: z.coerce
    .number()
    .int()
    .refine((val) => val !== 0, {
      message: 'products.validation.adjustment.nonZero'
    }),
  reason: z.string().min(1, 'products.validation.reason.required').max(200)
})

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>
