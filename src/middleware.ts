import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/session';

export async function middleware(request: NextRequest) {
  // First, refresh session if exists
  const res = await updateSession(request);

  // Protected paths mapping
  const path = request.nextUrl.pathname;
  const isProtectedAdmin = path.startsWith('/admin') || path.startsWith('/expenses');
  const isProtectedMember = path.startsWith('/vault') || path === '/' || path.startsWith('/places');
  const isAuthRoute = path.startsWith('/auth');

  // Skip middleware for static files and api
  if (path.startsWith('/_next') || path.includes('.')) {
    return res || NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie && (isProtectedAdmin || isProtectedMember)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (sessionCookie && isProtectedAdmin) {
    // Check role manually (as JWT verify is heavy in middleware, but since we are using jose, it's edge compatible!)
    // We can do a quick check, but NextJS middleware is edge runtime, `jose` works there.
    // However, it's cleaner to decode it or just trust the auth route. Let's decode it.
    try {
      const { jwtVerify } = await import('jose');
      const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-development-only';
      const key = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(sessionCookie, key);
      
      if (payload.role !== 'FAMILY_HEAD') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // Invalid token
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return res || NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
