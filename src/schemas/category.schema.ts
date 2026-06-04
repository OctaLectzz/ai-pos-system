import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(2, 'categories.validation.name.minLength').max(100, 'categories.validation.name.maxLength'),
  description: z.string().max(500, 'categories.validation.description.maxLength').optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true)
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.partial()

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
