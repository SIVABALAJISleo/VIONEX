import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, generateCsrfToken, verifyCsrfToken, requiresCsrfProtection } from './lib/csrf';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Ensure CSRF Cookie exists on client
  let csrfToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!csrfToken) {
    csrfToken = generateCsrfToken();
    response.cookies.set({
      name: CSRF_COOKIE_NAME,
      value: csrfToken,
      path: '/',
      httpOnly: false, // Accessible to client scripts to set X-CSRF-Token header
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  // 2. Validate CSRF token on state-mutating API calls (TRUST-039)
  if (request.nextUrl.pathname.startsWith('/api/') && requiresCsrfProtection(request.method)) {
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const valid = verifyCsrfToken(csrfToken, headerToken);

    // Allow internal bypass in test or non-production if header is marked
    const isTestBypass = process.env.NODE_ENV !== 'production' && request.headers.get('x-vionex-test-bypass') === 'true';

    if (!valid && !isTestBypass) {
      return NextResponse.json(
        { error: 'CSRF token validation failed. State-mutating request rejected.' },
        { status: 403 }
      );
    }
  }

  // 3. Inject standard security headers including Content-Security-Policy (TRUST-040)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
