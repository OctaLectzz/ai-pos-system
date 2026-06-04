import { routing } from '@/i18n/routing'
import { updateSession } from '@/lib/supabase/proxy'
import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest): Promise<Response> {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/api')) {
    return updateSession(request)
  }

  // 1. Run next-intl middleware first to check locale routing
  const response = intlMiddleware(request)

  // 2. If next-intl redirects (e.g. to default locale), return that response
  if (response.status === 307 || response.status === 308 || response.headers.has('location')) {
    return response
  }

  // 3. Run Supabase session validation and update cookies
  const supabaseResponse = await updateSession(request)

  // 4. Merge next-intl locale headers into the supabase response so localized routing works
  response.headers.forEach((value, key) => {
    supabaseResponse.headers.set(key, value)
  })

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files with common image/vector extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
