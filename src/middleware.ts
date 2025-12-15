import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ['/login']; // already has token
const protectedRoutes = ['/dashboard']; // requires token

export default async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Protected routes (like / dashboard): require a token, otherwise redirect to login
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
  
    if (token) return NextResponse.next();
    const redirectUrl = new URL('/login', request.nextUrl.origin);
    redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl);
  }

  // Auth routes (like /login): if user already has a token, redirect to dashboard
  if (authRoutes.includes(request.nextUrl.pathname)) {
    if (!token) return NextResponse.next();
    return NextResponse.redirect(new URL('/dashboard/diplomas', request.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
matcher: ["/login", "/dashboard/:path*"] // middleware works only on login,dashboard,any dasboard sub page
};