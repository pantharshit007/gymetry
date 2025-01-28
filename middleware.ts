import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { authRoutes, DEFAULT_LOGIN_REDIRECT } from "@/utils/apiRoutes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Redirect authenticated users to `/DEFAULT_LOGIN_REDIRECT`
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/api/mobile/:path*",
  ],
};
