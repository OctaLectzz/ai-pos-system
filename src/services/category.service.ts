import type { CreateCategoryInput, UpdateCategoryInput } from '@/schemas/category.schema'
import type { ApiResponse } from '@/types/api.types'
import type { Category, CategoryListParams } from '@/types/category.types'
import axios from 'axios'

const BASE_URL = '/api/categories'

export async function getCategories(params?: CategoryListParams): Promise<ApiResponse<Category[]>> {
  const response = await axios.get<ApiResponse<Category[]>>(BASE_URL, { params })
  return response.data
}

export async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
  const response = await axios.get<ApiResponse<Category>>(`${BASE_URL}/${id}`)
  return response.data
}

export async function createCategory(data: CreateCategoryInput): Promise<ApiResponse<Category>> {
  const response = await axios.post<ApiResponse<Category>>(BASE_URL, data)
  return response.data
}

export async function updateCategory(id: string, data: UpdateCategoryInput): Promise<ApiResponse<Category>> {
  const response = await axios.put<ApiResponse<Category>>(`${BASE_URL}/${id}`, data)
  return response.data
}

export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  const response = await axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`)
  return response.data
}
