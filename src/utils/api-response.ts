import type { ApiResponse } from '@/types/api.types'
import { NextResponse } from 'next/server'

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200,
  meta?: ApiResponse<T>['meta']
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      meta
    },
    { status }
  )
}

export function errorResponse(message: string = 'Error', status: number = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      message
    },
    { status }
  )
}
