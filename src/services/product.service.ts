import type { CreateProductInput, StockAdjustmentInput, UpdateProductInput } from '@/schemas/product.schema'
import type { ApiResponse } from '@/types/api.types'
import type { Product, ProductListParams } from '@/types/product.types'

const BASE_URL = '/api/products'

export async function getProducts(params?: ProductListParams): Promise<ApiResponse<Product[]>> {
  const searchParams = new URLSearchParams()

  if (params?.search) searchParams.set('search', params.search)
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize))

  const query = searchParams.toString()
  const url = query ? `${BASE_URL}?${query}` : BASE_URL

  const response = await fetch(url)
  return response.json() as Promise<ApiResponse<Product[]>>
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  const response = await fetch(`${BASE_URL}/${id}`)
  return response.json() as Promise<ApiResponse<Product>>
}

export async function createProduct(data: CreateProductInput): Promise<ApiResponse<Product>> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json() as Promise<ApiResponse<Product>>
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<ApiResponse<Product>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json() as Promise<ApiResponse<Product>>
}

export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
  return response.json() as Promise<ApiResponse<null>>
}

export async function adjustProductStock(id: string, data: StockAdjustmentInput): Promise<ApiResponse<Product>> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stockAdjustment: data })
  })
  return response.json() as Promise<ApiResponse<Product>>
}
