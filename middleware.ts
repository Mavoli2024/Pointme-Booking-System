import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Security headers
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Rate limiting headers (basic)
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')
  
  // Handle authentication routes
  if (pathname.startsWith('/auth/')) {
    return response
  }
  
  // Handle API routes with additional security
  if (pathname.startsWith('/api/')) {
    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
  
  // Allow static files and Next.js internal routes
  if (pathname.includes('.') || pathname.startsWith('/_next/')) {
    return response
  }
  
  // Redirect www to non-www (if needed)
  if (pathname.startsWith('/www.')) {
    return NextResponse.redirect(new URL(pathname.replace('/www.', '/'), request.url))
  }
  
  // Handle trailing slashes
  if (pathname !== '/' && pathname.endsWith('/')) {
    return NextResponse.redirect(new URL(pathname.slice(0, -1), request.url))
  }
  
  return response
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
