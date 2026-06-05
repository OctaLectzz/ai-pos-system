'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { createPrinter, deletePrinter, getPrinters, updatePrinter } from '@/services/receipt.service'

import type { PrinterInput, UpdatePrinterInput } from '@/schemas/receipt.schema'

const PRINTERS_KEY = 'printers'

export function usePrinters() {
  return useQuery({
    queryKey: [PRINTERS_KEY],
    queryFn: () => getPrinters()
  })
}

export function useCreatePrinter() {
  const queryClient = useQueryClient()
  const t = useTranslations('receipt')

  return useMutation({
    mutationFn: (data: PrinterInput) => createPrinter(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRINTERS_KEY] })
        toast.success(t('toast.printerAdded'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.printerAddError'))
    }
  })
}

export function useUpdatePrinter() {
  const queryClient = useQueryClient()
  const t = useTranslations('receipt')

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePrinterInput }) => updatePrinter(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRINTERS_KEY] })
        toast.success(t('toast.printerUpdated'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.printerUpdateError'))
    }
  })
}

export function useDeletePrinter() {
  const queryClient = useQueryClient()
  const t = useTranslations('receipt')

  return useMutation({
    mutationFn: (id: string) => deletePrinter(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRINTERS_KEY] })
        toast.success(t('toast.printerDeleted'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.printerDeleteError'))
    }
  })
}

export function useSetDefaultPrinter() {
  const queryClient = useQueryClient()
  const t = useTranslations('receipt')

  return useMutation({
    mutationFn: (id: string) => updatePrinter(id, { isDefault: true }),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRINTERS_KEY] })
        toast.success(t('toast.defaultPrinterSet'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.printerUpdateError'))
    }
  })
}
