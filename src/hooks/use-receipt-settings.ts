'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { getReceiptSettings, updateReceiptSettings } from '@/services/receipt.service'

import type { ReceiptSettingsInput } from '@/schemas/receipt.schema'

const RECEIPT_SETTINGS_KEY = 'receipt-settings'

export function useReceiptSettings() {
  return useQuery({
    queryKey: [RECEIPT_SETTINGS_KEY],
    queryFn: () => getReceiptSettings()
  })
}

export function useUpdateReceiptSettings() {
  const queryClient = useQueryClient()
  const t = useTranslations('receipt')

  return useMutation({
    mutationFn: (data: ReceiptSettingsInput) => updateReceiptSettings(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [RECEIPT_SETTINGS_KEY] })
        toast.success(t('toast.settingsUpdated'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.settingsError'))
    }
  })
}
