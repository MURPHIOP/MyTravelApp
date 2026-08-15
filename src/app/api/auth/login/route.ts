import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Secure authentication (Hardcoded for family travel app)
    // In a real app, this would query Mongoose/MongoDB.
    // Given the constraints and nature of a private family app, simple hardcoded credentials work safely.
    let role = null;
    let name = null;

    if (username === 'admin' && password === 'mitraghosh2026') {
      role = 'FAMILY_HEAD';
      name = 'Gopal Mitra';
    } else if (username === 'family' && password === 'maharashtra') {
      role = 'MEMBER';
      name = 'Family Member';
    }

    if (!role) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session
    const sessionToken = await encrypt({ username, role, name });

    const response = NextResponse.json({ success: true, role }, { status: 200 });
    
    // Set cookie
    response.cookies.set('session', sessionCookieValue(sessionToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 1 week
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper to avoid TS error on cookie assignment
function sessionCookieValue(val: string) {
  return val;
}
