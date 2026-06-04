import { prisma } from '@/lib/prisma'
import { updateCategorySchema } from '@/schemas/category.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/categories/[id] — Get single category
export async function GET(_request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    })

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    return successResponse(category, 'Category fetched successfully')
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return errorResponse('Failed to fetch category', 500)
  }
}

// PUT /api/categories/[id] — Update category
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateCategorySchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation failed', 400)
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse('Category not found', 404)
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description || null }),
        ...(parsed.data.sortOrder !== undefined && { sortOrder: parsed.data.sortOrder }),
        ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive })
      },
      include: { _count: { select: { products: true } } }
    })

    return successResponse(category, 'Category updated successfully')
  } catch (error) {
    console.error('Failed to update category:', error)
    return errorResponse('Failed to update category', 500)
  }
}

// DELETE /api/categories/[id] — Delete category
export async function DELETE(_request: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const { id } = await params

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    })

    if (!existing) {
      return errorResponse('Category not found', 404)
    }

    if (existing._count.products > 0) {
      return errorResponse('Cannot delete category with existing products', 400)
    }

    await prisma.category.delete({ where: { id } })

    return successResponse(null, 'Category deleted successfully')
  } catch (error) {
    console.error('Failed to delete category:', error)
    return errorResponse('Failed to delete category', 500)
  }
}
