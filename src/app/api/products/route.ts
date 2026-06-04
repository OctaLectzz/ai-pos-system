import { prisma } from '@/lib/prisma'
import { createProductSchema } from '@/schemas/product.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// GET /api/products — List products
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (status) {
      where.status = status
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.product.count({ where })
    ])

    return successResponse(products, 'Products fetched successfully', 200, {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return errorResponse('Failed to fetch products', 500)
  }
}

// POST /api/products — Create product
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const parsed = createProductSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation failed', 400)
    }

    const sku = parsed.data.sku || `SKU-${uuidv4().slice(0, 8).toUpperCase()}`

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        categoryId: parsed.data.categoryId,
        sku,
        description: parsed.data.description || null,
        price: parsed.data.price,
        discountPrice: parsed.data.discountPrice ? Number(parsed.data.discountPrice) : null,
        costPrice: parsed.data.costPrice ? Number(parsed.data.costPrice) : null,
        stock: parsed.data.stock ?? 0,
        minStockThreshold: parsed.data.minStockThreshold ?? 5,
        unit: parsed.data.unit ?? 'pcs',
        weight: parsed.data.weight ? Number(parsed.data.weight) : null,
        status: parsed.data.status ?? 'ACTIVE',
        storeId: 'default-store' // TODO: get from auth session
      },
      include: { category: true }
    })

    return successResponse(product, 'Product created successfully', 201)
  } catch (error) {
    console.error('Failed to create product:', error)
    return errorResponse('Failed to create product', 500)
  }
}
