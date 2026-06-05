import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

/**
 * Generates a unique order ID for the given store in the format NXYYYYMMDDXXXX.
 * Example: NX202606050001
 *
 * @param storeId - The ID of the store
 * @returns A promise that resolves to the generated order ID string
 */
export async function generateOrderId(storeId: string): Promise<string> {
  const dateStr = format(new Date(), 'yyyyMMdd')
  const prefix = `NX${dateStr}`

  // Find the latest order for this store today
  const latestOrder = await prisma.order.findFirst({
    where: {
      storeId,
      orderNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      orderNumber: 'desc'
    },
    select: {
      orderNumber: true
    }
  })

  if (!latestOrder) {
    // First order of the day
    return `${prefix}0001`
  }

  // Extract the last 4 digits
  const lastSequenceStr = latestOrder.orderNumber.substring(prefix.length)
  const lastSequence = parseInt(lastSequenceStr, 10)

  if (isNaN(lastSequence)) {
    // Fallback if somehow the format was broken
    return `${prefix}0001`
  }

  // Increment and pad with leading zeros
  const nextSequence = lastSequence + 1
  const nextSequenceStr = nextSequence.toString().padStart(4, '0')

  return `${prefix}${nextSequenceStr}`
}
