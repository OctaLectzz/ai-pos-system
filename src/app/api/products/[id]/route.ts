import { prisma } from '@/lib/prisma'
import { stockAdjustmentSchema, updateProductSchema } from '@/schemas/product.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/[id] — Get single product
export async function GET(_request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true }
    })

    if (!product) {
      return errorResponse('Product not found', 404)
    }

    return successResponse(product, 'Product fetched successfully')
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return errorResponse('Failed to fetch product', 500)
  }
}

// PUT /api/products/[id] — Update product
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse('Product not found', 404)
    }

    // Check if this is a stock adjustment request
    if (body.stockAdjustment) {
      const parsedAdjustment = stockAdjustmentSchema.safeParse(body.stockAdjustment)
      if (!parsedAdjustment.success) {
        return errorResponse(parsedAdjustment.error.issues[0]?.message || 'Validation failed', 400)
      }

      const { adjustment, reason } = parsedAdjustment.data
      const newStock = existing.stock + adjustment

      if (newStock < 0) {
        return errorResponse('validation.stock.insufficient', 400)
      }

      const product = await prisma.$transaction(async (tx) => {
        // Create stock log
        await tx.stockLog.create({
          data: {
            productId: id,
            previousStock: existing.stock,
            newStock,
            adjustment,
            reason,
            createdBy: 'default-user' // TODO: get from auth session
          }
        })

        // Update product stock
        return tx.product.update({
          where: { id },
          data: { stock: newStock },
          include: { category: true }
        })
      })

      return successResponse(product, 'Stock adjusted successfully')
    }

    const parsed = updateProductSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation failed', 400)
    }

    const updateData: Record<string, unknown> = {}

    if (parsed.data.name !== undefined) updateData.name = parsed.data.name
    if (parsed.data.categoryId !== undefined) updateData.categoryId = parsed.data.categoryId
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description || null
    if (parsed.data.price !== undefined) updateData.price = parsed.data.price
    if (parsed.data.discountPrice !== undefined) updateData.discountPrice = parsed.data.discountPrice ? Number(parsed.data.discountPrice) : null
    if (parsed.data.costPrice !== undefined) updateData.costPrice = parsed.data.costPrice ? Number(parsed.data.costPrice) : null
    if (parsed.data.stock !== undefined) updateData.stock = parsed.data.stock
    if (parsed.data.minStockThreshold !== undefined) updateData.minStockThreshold = parsed.data.minStockThreshold
    if (parsed.data.unit !== undefined) updateData.unit = parsed.data.unit
    if (parsed.data.weight !== undefined) updateData.weight = parsed.data.weight ? Number(parsed.data.weight) : null
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true }
    })

    return successResponse(product, 'Product updated successfully')
  } catch (error) {
    console.error('Failed to update product:', error)
    return errorResponse('Failed to update product', 500)
  }
}

// DELETE /api/products/[id] — Delete product
export async function DELETE(_request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse('Product not found', 404)
    }

    await prisma.product.delete({ where: { id } })

    return successResponse(null, 'Product deleted successfully')
  } catch (error) {
    console.error('Failed to delete product:', error)
    return errorResponse('Failed to delete product', 500)
  }
}
