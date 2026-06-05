'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { createOrder, getOrderById, getOrders, updateOrderStatus } from '@/services/order.service'

import type { CreateOrderInput, UpdateOrderStatusInput } from '@/schemas/order.schema'
import type { OrderListParams } from '@/types/order.types'

const ORDERS_KEY = 'orders'

export function useOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: [ORDERS_KEY, params],
    queryFn: () => getOrders(params)
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: () => getOrderById(id),
    enabled: !!id
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  const t = useTranslations('orders')

  return useMutation({
    mutationFn: (data: CreateOrderInput) => createOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] })
        // Also invalidate products since stock was decremented
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success(t('toast.createSuccess'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.createError'))
    }
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const t = useTranslations('orders')

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusInput }) => updateOrderStatus(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] })
        // If it was cancelled or reactivated, stock might have changed
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success(t('toast.updateSuccess'))
      } else {
        const errorKey = response.message
        toast.error(t.has(errorKey) ? t(errorKey) : errorKey)
      }
    },
    onError: () => {
      toast.error(t('toast.updateError'))
    }
  })
}
