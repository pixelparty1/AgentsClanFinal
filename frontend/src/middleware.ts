/* ══════════════════════════════════════════════════════════════════════════════
   Next.js Middleware - Server-side Route Protection
   ══════════════════════════════════════════════════════════════════════════════ */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = ['/admin'];

// Public routes that don't need authentication
const publicRoutes = ['/', '/home', '/community', '/events', '/services', '/membership', '/store', '/rewards'];

export default async function middleware(request: NextRequest) {
  // DEVELOPMENT MODE: Skip all authentication
  // TODO: Remove this bypass before production
  return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Check if the route is protected (admin routes)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For admin routes, verify session server-side
  const session = await auth();

  // If no session or user is not admin, redirect to home
  if (!session || !session.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('unauthorized', '1');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes but exclude static files and API routes
    '/admin/:path*',
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};
