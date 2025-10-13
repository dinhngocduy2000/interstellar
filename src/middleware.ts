import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { setCookiesAction } from "./actions/cookie";
import { refreshTokenAction } from "./actions/refresh-token";
import { COOKIE_KEYS } from "./lib/enum/cookie-keys";
import { ROUTE_PATH } from "./lib/enum/route-path";

const publicRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken =
    request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value ?? "";
  const saveSession = request.cookies.get(COOKIE_KEYS.SAVE_SESSION)?.value;
  const { pathname } = request.nextUrl;
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(ROUTE_PATH.HOME, request.url));
    }
    return NextResponse.next();
  }

  // Check if token is missing or expired
  if (!token) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL(ROUTE_PATH.LOGIN, request.url));
    }
    // Refresh failed, redirect to login
    const res = await refreshTokenAction({ refreshToken: refreshToken });
    if (!res) {
      return;
    }
    await setCookiesAction({
      ...res,
      saveSession: saveSession === "true" ? true : false,
    });
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
