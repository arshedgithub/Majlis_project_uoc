import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup';

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/signup, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/api/:path*',
  ],
}; 