import { prisma } from '@/lib/prisma'
import { printerSchema } from '@/schemas/receipt.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'

// GET /api/printers — List all printers for current store
export async function GET(): Promise<Response> {
  try {
    // TODO: Get storeId from session when auth is implemented
    const store = await prisma.store.findFirst()
    if (!store) {
      return errorResponse('Store not found', 404)
    }

    const printers = await prisma.printer.findMany({
      where: { storeId: store.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    })

    return successResponse(printers)
  } catch (error) {
    console.error('Error fetching printers:', error)
    return errorResponse('Failed to fetch printers', 500)
  }
}

// POST /api/printers — Add a new printer
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: unknown = await request.json()
    const parsed = printerSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation error', 400)
    }

    // TODO: Get storeId from session when auth is implemented
    const store = await prisma.store.findFirst()
    if (!store) {
      return errorResponse('Store not found', 404)
    }

    // If this printer is set as default, unset all others first
    if (parsed.data.isDefault) {
      await prisma.printer.updateMany({
        where: { storeId: store.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    const printer = await prisma.printer.create({
      data: {
        storeId: store.id,
        ...parsed.data
      }
    })

    return successResponse(printer, 'Printer added', 201)
  } catch (error) {
    console.error('Error creating printer:', error)
    return errorResponse('Failed to add printer', 500)
  }
}
