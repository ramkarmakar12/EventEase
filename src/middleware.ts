import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/', '/auth/signin', '/auth/signup'];

// Protected routes that require authentication
const protectedRoutes = [
  '/events/create',
  '/events/edit',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.includes(route));

  // If this is not a protected route and starts with /events/, allow access
  if (pathname.startsWith('/events/') && !isProtectedRoute) {
    return NextResponse.next();
  }  // If this is a protected route, require auth
  if (isProtectedRoute || !pathname.startsWith('/events/')) {
    try {
      // Get the session cookie
      const sessionCookie = request.cookies.get('session')?.value;
      if (!sessionCookie) {
        throw new Error('No session cookie found');
      }

      // Verify session by calling the me endpoint
      const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: {
          'Cookie': `session=${sessionCookie}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid session');
      }

      const data = await response.json();
      const user = data.user;

      // Role-based access control
      if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (pathname.startsWith('/staff') && !['ADMIN', 'STAFF'].includes(user.role)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Redirect to signin page with callback URL
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Allow access to all other routes
  return NextResponse.next();
}

// Update matcher config
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/signin|auth/signup|$).*)',
  ],
};
