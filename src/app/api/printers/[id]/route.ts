import { prisma } from '@/lib/prisma'
import { updatePrinterSchema } from '@/schemas/receipt.schema'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NextRequest } from 'next/server'

// PUT /api/printers/[id] — Update a printer
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params
    const body: unknown = await request.json()
    const parsed = updatePrinterSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Validation error', 400)
    }

    const existing = await prisma.printer.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse('Printer not found', 404)
    }

    // If setting as default, unset all others first
    if (parsed.data.isDefault) {
      await prisma.printer.updateMany({
        where: { storeId: existing.storeId, isDefault: true },
        data: { isDefault: false }
      })
    }

    const printer = await prisma.printer.update({
      where: { id },
      data: parsed.data
    })

    return successResponse(printer, 'Printer updated')
  } catch (error) {
    console.error('Error updating printer:', error)
    return errorResponse('Failed to update printer', 500)
  }
}

// DELETE /api/printers/[id] — Remove a printer
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params

    const existing = await prisma.printer.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse('Printer not found', 404)
    }

    await prisma.printer.delete({ where: { id } })

    return successResponse(null, 'Printer deleted')
  } catch (error) {
    console.error('Error deleting printer:', error)
    return errorResponse('Failed to delete printer', 500)
  }
}
