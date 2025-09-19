import { NextResponse } from "next/server";

// Only protect these routes
const protectedRoutes = new Set([
  "/listing",
  "/account",
]);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only run middleware for protected routes
  if (!protectedRoutes.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth-token")?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/listing/:path*",
    "/account/:path*",
  ],
};
