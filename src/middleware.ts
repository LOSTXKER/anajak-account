import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API auth routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/forgot-password']
  const isPublicPath = publicPaths.includes(pathname)

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value

  // If accessing protected route without token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing auth pages with valid token, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // Invalid token, continue to login/register
    }
  }

  // Verify token for protected routes
  if (!isPublicPath && token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET)
      
      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', verified.payload.userId as string)
      requestHeaders.set('x-user-email', verified.payload.email as string)
      requestHeaders.set('x-tenant-id', verified.payload.tenantId as string)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

