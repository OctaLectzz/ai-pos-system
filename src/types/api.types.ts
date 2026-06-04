export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string
  meta?: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}
