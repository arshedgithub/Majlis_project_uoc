import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { appConfig } from '@/config';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/api/auth/login' || path === '/api/auth/register';

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect logic
  if (isPublicPath && token) {
    try {
      // Verify token
      await jwtVerify(token, new TextEncoder().encode(appConfig.JWT_SECRET));
      // If user is logged in and tries to access login/signup, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      // If token is invalid, clear it and allow access to public paths
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/api/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
