import { prisma } from '@/lib/prisma'
import { receiptSettingsSchema } from '@/schemas/receipt.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'

// GET /api/receipt-settings — Get receipt settings for current store
export async function GET(): Promise<Response> {
  try {
    // TODO: Get storeId from session when auth is implemented
    const store = await prisma.store.findFirst()
    if (!store) {
      return errorResponse('Store not found', 404)
    }

    const settings = await prisma.receiptSettings.findUnique({
      where: { storeId: store.id }
    })

    return successResponse(settings)
  } catch (error) {
    console.error('Error fetching receipt settings:', error)
    return errorResponse('Failed to fetch receipt settings', 500)
  }
}

// PUT /api/receipt-settings — Update receipt settings (upsert)
export async function PUT(request: NextRequest): Promise<Response> {
  try {
    const body: unknown = await request.json()
    const parsed = receiptSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation error', 400)
    }

    // TODO: Get storeId from session when auth is implemented
    const store = await prisma.store.findFirst()
    if (!store) {
      return errorResponse('Store not found', 404)
    }

    const settings = await prisma.receiptSettings.upsert({
      where: { storeId: store.id },
      create: {
        storeId: store.id,
        ...parsed.data
      },
      update: parsed.data
    })

    return successResponse(settings, 'Receipt settings updated')
  } catch (error) {
    console.error('Error updating receipt settings:', error)
    return errorResponse('Failed to update receipt settings', 500)
  }
}
