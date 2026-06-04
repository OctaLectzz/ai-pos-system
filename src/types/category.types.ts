export interface Category {
  id: string
  storeId: string
  name: string
  description: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    products: number
  }
}

export interface CategoryListParams {
  search?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}
