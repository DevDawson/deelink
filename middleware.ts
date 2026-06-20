import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dashboard protection is handled client-side via AuthGuard
// because token lives in localStorage (not cookies).
// This middleware handles redirects for already-logged-in users
// hitting auth pages via a cookie set on login.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get('deelink_logged_in')?.value

  // Redirect logged-in users away from auth pages
  if (authCookie === '1' && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register'],
}
