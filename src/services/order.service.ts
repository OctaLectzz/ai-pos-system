import type { CreateOrderInput, UpdateOrderStatusInput } from '@/schemas/order.schema'
import type { ApiResponse } from '@/types/api.types'
import type { Order, OrderListParams } from '@/types/order.types'
import axios from 'axios'

const BASE_URL = '/api/orders'

export async function getOrders(params?: OrderListParams): Promise<ApiResponse<Order[]>> {
  const response = await axios.get<ApiResponse<Order[]>>(BASE_URL, { params })
  return response.data
}

export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  const response = await axios.get<ApiResponse<Order>>(`${BASE_URL}/${id}`)
  return response.data
}

export async function createOrder(data: CreateOrderInput): Promise<ApiResponse<Order>> {
  const response = await axios.post<ApiResponse<Order>>(BASE_URL, data)
  return response.data
}

export async function updateOrderStatus(id: string, data: UpdateOrderStatusInput): Promise<ApiResponse<Order>> {
  const response = await axios.put<ApiResponse<Order>>(`${BASE_URL}/${id}`, data)
  return response.data
}
