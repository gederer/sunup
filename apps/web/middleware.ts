/**
 * Next.js Middleware for better-auth Route Protection
 *
 * Protects routes by checking for valid authentication session.
 * Redirects unauthenticated users to login page.
 *
 * Story: 1.5 - Integrate better-auth Authentication (Phase 4)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Routes that require authentication
 */
const protectedRoutes = [
  '/profile',
  '/admin',
  '/dashboard',
  // Add more protected routes here
]

/**
 * Routes that are public (accessible without auth)
 */
const publicRoutes = [
  '/login',
  '/signup',
  '/auth', // better-auth endpoints
  // Demo pages are public for now
  '/theme-demo',
  '/typography-demo',
  '/convex-demo',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Check for better-auth session cookie
    const sessionToken = request.cookies.get('better-auth.session_token')

    if (!sessionToken) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
