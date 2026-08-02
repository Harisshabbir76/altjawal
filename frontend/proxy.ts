import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE = '/altjawal/admin-panel/dashboard';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard root is always public — it shows the login form when unauthenticated
  if (pathname === BASE || pathname === BASE + '/') {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_token');
  if (!token) {
    return NextResponse.redirect(new URL(BASE, request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: '/altjawal/admin-panel/dashboard/:path*' };
