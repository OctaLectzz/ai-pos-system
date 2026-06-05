import type { PrinterInput, ReceiptSettingsInput, UpdatePrinterInput } from '@/schemas/receipt.schema'
import type { ApiResponse } from '@/types/api.types'
import type { Printer, ReceiptSettings } from '@/types/receipt.types'
import axios from 'axios'

// ─── Receipt Settings ─────────────────────────────────

export async function getReceiptSettings(): Promise<ApiResponse<ReceiptSettings | null>> {
  const response = await axios.get<ApiResponse<ReceiptSettings | null>>('/api/receipt-settings')
  return response.data
}

export async function updateReceiptSettings(data: ReceiptSettingsInput): Promise<ApiResponse<ReceiptSettings>> {
  const response = await axios.put<ApiResponse<ReceiptSettings>>('/api/receipt-settings', data)
  return response.data
}

// ─── Printers ─────────────────────────────────────────

export async function getPrinters(): Promise<ApiResponse<Printer[]>> {
  const response = await axios.get<ApiResponse<Printer[]>>('/api/printers')
  return response.data
}

export async function createPrinter(data: PrinterInput): Promise<ApiResponse<Printer>> {
  const response = await axios.post<ApiResponse<Printer>>('/api/printers', data)
  return response.data
}

export async function updatePrinter(id: string, data: UpdatePrinterInput): Promise<ApiResponse<Printer>> {
  const response = await axios.put<ApiResponse<Printer>>(`/api/printers/${id}`, data)
  return response.data
}

export async function deletePrinter(id: string): Promise<ApiResponse<null>> {
  const response = await axios.delete<ApiResponse<null>>(`/api/printers/${id}`)
  return response.data
}
