import { prisma } from '@/lib/prisma'
import { createOrderSchema } from '@/schemas/order.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { generateOrderId } from '@/utils/generate-order-id'
import { NextRequest } from 'next/server'

// GET /api/orders — List orders
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const source = searchParams.get('source')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [{ orderNumber: { contains: search, mode: 'insensitive' } }, { customerName: { contains: search, mode: 'insensitive' } }]
    }

    if (status) where.status = status
    if (paymentStatus) where.paymentStatus = paymentStatus
    if (source) where.source = source

    if (dateFrom || dateTo) {
      const createdAtFilter: { gte?: Date; lte?: Date } = {}
      if (dateFrom) createdAtFilter.gte = new Date(dateFrom)
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        createdAtFilter.lte = toDate
      }
      where.createdAt = createdAtFilter
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.order.count({ where })
    ])

    return successResponse(orders, 'Orders fetched successfully', 200, {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return errorResponse('Failed to fetch orders', 500)
  }
}

// POST /api/orders — Create order
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation failed', 400)
    }

    const storeId = 'default-store' // TODO: get from auth session
    const { items, paymentMethod, customerName, customerPhone, notes, source } = parsed.data

    // Fetch products to calculate totals and verify stock
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    let subtotal = 0
    const orderItemsData: { productId: string; productName: string; quantity: number; unitPrice: number; subtotal: number }[] = []

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return errorResponse(`Product not found: ${item.productId}`, 400)
      }

      if (product.stock < item.quantity) {
        return errorResponse(`Insufficient stock for product: ${product.name}`, 400)
      }

      const unitPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price)
      const itemSubtotal = unitPrice * item.quantity

      subtotal += itemSubtotal

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal: itemSubtotal
      })
    }

    const taxAmount = 0 // Implement tax logic later based on Store config
    const discountAmount = 0 // Implement order-level discount logic later
    const totalAmount = subtotal + taxAmount - discountAmount

    const paymentStatus = paymentMethod ? 'PAID' : 'PENDING'
    const status = paymentMethod ? 'COMPLETED' : 'NEW'

    const orderNumber = await generateOrderId(storeId)

    // Execute in a transaction to ensure data integrity
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const newOrder = await tx.order.create({
        data: {
          storeId,
          orderNumber,
          status,
          source,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          paymentMethod,
          paymentStatus,
          notes: notes || null,
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          completedAt: status === 'COMPLETED' ? new Date() : null,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      })

      // 2. Decrement stock & create stock logs
      for (const item of items) {
        const product = productMap.get(item.productId)!
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
            reason: 'order',
            referenceId: newOrder.id,
            createdBy: 'default-user' // TODO: get from auth session
          }
        })
      }

      return newOrder
    })

    return successResponse(order, 'Order created successfully', 201)
  } catch (error) {
    console.error('Failed to create order:', error)
    return errorResponse('Failed to create order', 500)
  }
}
