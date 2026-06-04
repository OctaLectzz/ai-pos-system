'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '@/services/category.service'

import type { CreateCategoryInput, UpdateCategoryInput } from '@/schemas/category.schema'
import type { CategoryListParams } from '@/types/category.types'

const CATEGORIES_KEY = 'categories'

export function useCategories(params?: CategoryListParams) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, params],
    queryFn: () => getCategories(params)
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, id],
    queryFn: () => getCategoryById(id),
    enabled: !!id
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const t = useTranslations('categories')

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] })
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

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const t = useTranslations('categories')

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => updateCategory(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] })
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

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const t = useTranslations('categories')

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] })
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
