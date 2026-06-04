import { prisma } from '@/lib/prisma'
import { createCategorySchema } from '@/schemas/category.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'

// GET /api/categories — List categories
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const isActive = searchParams.get('isActive')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '50', 10)

    const where: Record<string, unknown> = {}

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.category.count({ where })
    ])

    return successResponse(categories, 'Categories fetched successfully', 200, {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return errorResponse('Failed to fetch categories', 500)
  }
}

// POST /api/categories — Create category
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json()
    const parsed = createCategorySchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation failed', 400)
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
        storeId: 'default-store' // TODO: get from auth session
      },
      include: { _count: { select: { products: true } } }
    })

    return successResponse(category, 'Category created successfully', 201)
  } catch (error) {
    console.error('Failed to create category:', error)
    return errorResponse('Failed to create category', 500)
  }
}
