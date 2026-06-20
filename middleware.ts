import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const loggedIn = request.cookies.get('deelink_logged_in')?.value === '1'
  const isAdmin  = request.cookies.get('deelink_role')?.value === 'admin'

  if (loggedIn && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register'],
}
