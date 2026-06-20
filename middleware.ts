import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect logged-in users away from auth pages
  // (token lives in localStorage, so we use a lightweight cookie as a hint)
  const authCookie = request.cookies.get('deelink_logged_in')?.value
  if (authCookie === '1' && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register'],
}
