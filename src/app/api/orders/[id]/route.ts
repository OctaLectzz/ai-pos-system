import { prisma } from '@/lib/prisma'
import { updateOrderStatusSchema } from '@/schemas/order.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/orders/[id] — Get single order
export async function GET(_request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    })

    if (!order) {
      return errorResponse('Order not found', 404)
    }

    return successResponse(order, 'Order fetched successfully')
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return errorResponse('Failed to fetch order', 500)
  }
}

// PUT /api/orders/[id] — Update order status/payment
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params
    const body = await request.json()

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    })

    if (!existingOrder) {
      return errorResponse('Order not found', 404)
    }

    const parsed = updateOrderStatusSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation failed', 400)
    }

    const { status, paymentStatus, paymentMethod } = parsed.data

    // Check if we need to restore stock (order cancelled)
    const isCancelling = status === 'CANCELLED' && existingOrder.status !== 'CANCELLED'
    // Check if we need to decrement stock (cancelled order reactivated - edge case, but good to handle)
    const isReactivating = status && status !== 'CANCELLED' && existingOrder.status === 'CANCELLED'

    const order = await prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = {}

      if (status) {
        updateData.status = status
        if (status === 'COMPLETED' && existingOrder.status !== 'COMPLETED') {
          updateData.completedAt = new Date()
        }
      }

      if (paymentStatus) updateData.paymentStatus = paymentStatus
      if (paymentMethod) updateData.paymentMethod = paymentMethod

      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData,
        include: { items: true }
      })

      // Handle stock restoration if cancelled
      if (isCancelling) {
        for (const item of existingOrder.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } })
          if (product) {
            const newStock = product.stock + item.quantity

            await tx.product.update({
              where: { id: product.id },
              data: { stock: newStock }
            })

            await tx.stockLog.create({
              data: {
                productId: product.id,
                previousStock: product.stock,
                newStock,
                adjustment: item.quantity,
                reason: 'order_cancelled',
                referenceId: updatedOrder.id,
                createdBy: 'default-user' // TODO: get from auth session
              }
            })
          }
        }
      } else if (isReactivating) {
        // Handle stock decrement if reactivated
        for (const item of existingOrder.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } })
          if (product) {
            if (product.stock < item.quantity) {
              throw new Error(`Insufficient stock for product: ${product.name} to reactivate order`)
            }

            const newStock = product.stock - item.quantity

            await tx.product.update({
              where: { id: product.id },
              data: { stock: newStock }
            })

            await tx.stockLog.create({
              data: {
                productId: product.id,
                previousStock: product.stock,
                newStock,
                adjustment: -item.quantity,
                reason: 'order_reactivated',
                referenceId: updatedOrder.id,
                createdBy: 'default-user' // TODO: get from auth session
              }
            })
          }
        }
      }

      return updatedOrder
    })

    return successResponse(order, 'Order updated successfully')
  } catch (error) {
    console.error('Failed to update order:', error)
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return errorResponse(error.message, 400)
    }
    return errorResponse('Failed to update order', 500)
  }
}
