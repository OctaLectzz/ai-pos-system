import type { Category } from './category.types'

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText: string | null
  sortOrder: number
  createdAt: string
}

export interface Product {
  id: string
  storeId: string
  categoryId: string
  sku: string
  name: string
  description: string | null
  price: number
  discountPrice: number | null
  costPrice: number | null
  stock: number
  minStockThreshold: number
  unit: string
  weight: number | null
  status: ProductStatus
  createdAt: string
  updatedAt: string
  category?: Category
  images?: ProductImage[]
}

export interface ProductListParams {
  search?: string
  categoryId?: string
  status?: ProductStatus
  page?: number
  pageSize?: number
}
