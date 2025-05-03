import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Login page руу redirect хийх эсэх
  const authRoutes = ['/dashboard', '/patientProfile'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute && !token) {
    return NextResponse.redirect(new URL('/authentication/login', request.url));
  }

  return NextResponse.next();
}