import type { CreateProductInput, StockAdjustmentInput, UpdateProductInput } from '@/schemas/product.schema'
import type { ApiResponse } from '@/types/api.types'
import type { Product, ProductListParams } from '@/types/product.types'
import axios from 'axios'

const BASE_URL = '/api/products'

export async function getProducts(params?: ProductListParams): Promise<ApiResponse<Product[]>> {
  const response = await axios.get<ApiResponse<Product[]>>(BASE_URL, { params })
  return response.data
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  const response = await axios.get<ApiResponse<Product>>(`${BASE_URL}/${id}`)
  return response.data
}

export async function createProduct(data: CreateProductInput): Promise<ApiResponse<Product>> {
  const response = await axios.post<ApiResponse<Product>>(BASE_URL, data)
  return response.data
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<ApiResponse<Product>> {
  const response = await axios.put<ApiResponse<Product>>(`${BASE_URL}/${id}`, data)
  return response.data
}

export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  const response = await axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`)
  return response.data
}

export async function adjustProductStock(id: string, data: StockAdjustmentInput): Promise<ApiResponse<Product>> {
  const response = await axios.put<ApiResponse<Product>>(`${BASE_URL}/${id}`, { stockAdjustment: data })
  return response.data
}
