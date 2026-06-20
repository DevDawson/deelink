import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host     = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // www.deelink.cc → deelink.cc (permanent redirect, runs before any page renders)
  if (host.startsWith('www.')) {
    const url  = request.nextUrl.clone()
    url.host   = host.slice(4)  // strip 'www.'
    url.port   = ''
    return NextResponse.redirect(url, { status: 301 })
  }

  // Redirect logged-in users away from auth pages
  // (token lives in localStorage, so we use a lightweight cookie as a hint)
  const authCookie = request.cookies.get('deelink_logged_in')?.value
  if (authCookie === '1' && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|svg|webp|ico)$).*)'],
}
