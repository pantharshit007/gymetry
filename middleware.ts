import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { authRoutes, DEFAULT_LOGIN_REDIRECT } from "@/utils/apiRoutes";
import { env } from "@/env";

const defaultOrigins = env.NODE_ENV === "development" ? ["*"] : [];
const envOrigins =
  env.NEXT_PUBLIC_API_URL?.split(",").map((url) => url.trim()) ?? [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

console.log("[Middleware] Allowed CORS Origins:", allowedOrigins); // For debugging

/**
 * Helper function to add CORS headers to a response
 */
function setCorsHeaders(response: NextResponse, origin: string): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "14400"); // Cache preflight for 4 hr
  return response;
}

export default auth((req) => {
  const { nextUrl, method } = req;
  const isLoggedIn = !!req.auth;
  const origin = req.headers.get("origin");

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith("/api/v1");
  let response: NextResponse;

  if (method === "OPTIONS" && isApiRoute) {
    if (origin && allowedOrigins.includes(origin)) {
      const response = new NextResponse(null, { status: 204 }); // 204 No Content for preflight
      return setCorsHeaders(response, origin);
    } else {
      return new NextResponse(
        "CORS policy does not allow this origin for OPTIONS.",
        { status: 403 },
      );
    }
  }

  // Redirect authenticated users to `/DEFAULT_LOGIN_REDIRECT`
  if (isAuthRoute && isLoggedIn) {
    response = NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  } else response = NextResponse.next();

  if (isApiRoute && origin && allowedOrigins.includes(origin)) {
    response = setCorsHeaders(response, origin);
  } else if (isApiRoute && origin) {
    console.warn(
      `[Middleware] Origin ${origin} not allowed for API route ${nextUrl.pathname}`,
    );
  }

  return response;
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
