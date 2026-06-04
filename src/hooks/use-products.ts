'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { adjustProductStock, createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '@/services/product.service'

import type { CreateProductInput, StockAdjustmentInput, UpdateProductInput } from '@/schemas/product.schema'
import type { ProductListParams } from '@/types/product.types'

const PRODUCTS_KEY = 'products'

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, params],
    queryFn: () => getProducts(params)
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, id],
    queryFn: () => getProductById(id),
    enabled: !!id
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const t = useTranslations('products')

  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
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

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const t = useTranslations('products')

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) => updateProduct(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
        toast.success(t('toast.updateSuccess'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.updateError'))
    }
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const t = useTranslations('products')

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
        toast.success(t('toast.deleteSuccess'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.deleteError'))
    }
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()
  const t = useTranslations('products')

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StockAdjustmentInput }) => adjustProductStock(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
        toast.success(t('toast.stockAdjustSuccess'))
      } else {
        toast.error(response.message)
      }
    },
    onError: () => {
      toast.error(t('toast.stockAdjustError'))
    }
  })
}
