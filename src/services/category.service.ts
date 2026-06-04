import type { CreateCategoryInput, UpdateCategoryInput } from '@/schemas/category.schema'
import type { ApiResponse } from '@/types/api.types'
import type { Category, CategoryListParams } from '@/types/category.types'

const BASE_URL = '/api/categories'

export async function getCategories(params?: CategoryListParams): Promise<ApiResponse<Category[]>> {
  const searchParams = new URLSearchParams()

  if (params?.search) searchParams.set('search', params.search)
  if (params?.isActive !== undefined) searchParams.set('isActive', String(params.isActive))
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize))

  const query = searchParams.toString()
  const url = query ? `${BASE_URL}?${query}` : BASE_URL

  const response = await fetch(url)
  return response.json() as Promise<ApiResponse<Category[]>>
}

export async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return response.json() as Promise<ApiResponse<Category>>
}

export async function createCategory(data: CreateCategoryInput): Promise<ApiResponse<Category>> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json() as Promise<ApiResponse<Category>>
}

export async function updateCategory(id: string, data: UpdateCategoryInput): Promise<ApiResponse<Category>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json() as Promise<ApiResponse<Category>>
}

export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
  return response.json() as Promise<ApiResponse<null>>
}
