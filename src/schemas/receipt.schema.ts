import { z } from 'zod'

export const receiptSettingsSchema = z.object({
  headerText: z.string().max(200).optional().nullable(),
  footerText: z.string().max(500).optional().nullable(),
  wifiName: z.string().max(100).optional().nullable(),
  wifiPassword: z.string().max(100).optional().nullable(),
  showLogo: z.boolean().default(false),
  showTax: z.boolean().default(true),
  showAddress: z.boolean().default(true),
  showPhone: z.boolean().default(true),
  paperWidth: z
    .number()
    .int()
    .refine((v) => v === 58 || v === 80, {
      message: 'Paper width must be 58 or 80'
    })
    .default(80)
})

export type ReceiptSettingsInput = z.infer<typeof receiptSettingsSchema>

export const printerSchema = z.object({
  name: z.string().min(1).max(100),
  deviceName: z.string().min(1).max(255),
  type: z.string().default('THERMAL'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true)
})

export type PrinterInput = z.infer<typeof printerSchema>

export const updatePrinterSchema = printerSchema.partial()

export type UpdatePrinterInput = z.infer<typeof updatePrinterSchema>
