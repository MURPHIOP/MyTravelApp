import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/session';

export async function proxy(request: NextRequest) {
  // First, refresh session if exists
  const res = await updateSession(request);

  // Protected paths mapping
  const path = request.nextUrl.pathname;
  const isProtectedAdmin = path.startsWith('/admin') || path.startsWith('/expenses');
  const isProtectedMember = false; // Allow public read access to vault
  const isAuthRoute = path.startsWith('/auth');

  // Skip middleware for static files and api
  if (path.startsWith('/_next') || path.includes('.')) {
    return res || NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie && (isProtectedAdmin || isProtectedMember)) {
    // Redirect to home where the auto-login prompt will handle authentication
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (sessionCookie && isProtectedAdmin) {
    try {
      const { jwtVerify } = await import('jose');
      const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-development-only';
      const key = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(sessionCookie, key);
      
      if (payload.role !== 'FAMILY_HEAD') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      // Invalid token
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res || NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
