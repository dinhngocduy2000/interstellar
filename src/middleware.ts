import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_KEYS } from "./lib/enum/cookie-keys";
import { ROUTE_PATH } from "./lib/enum/route-path";
import { refreshTokenAction } from "./actions/refresh-token";
import { setCookiesAction } from "./actions/cookie";

const publicRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken =
    request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value ?? "";
  const saveSession = request.cookies.get(COOKIE_KEYS.SAVE_SESSION)?.value;
  const { pathname } = request.nextUrl;
  console.log(`CHECKING PATHNAME: ${pathname}`);
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(ROUTE_PATH.HOME, request.url));
    }
    return NextResponse.next();
  }

  console.log(`CHECK TOKEN: ${token}`);
  // Check if token is missing or expired
  if (!token) {
    console.log("NO TOKEN or EXPIRED for:", pathname);
    if (!refreshToken) {
      return NextResponse.redirect(new URL(ROUTE_PATH.LOGIN, request.url));
    }
    // Refresh failed, redirect to login
    const res = await refreshTokenAction({ token: refreshToken });
    if (!res.data) {
      return;
    }
    await setCookiesAction({
      ...res.data,
      saveSession: saveSession === "true" ? true : false,
    });
    return NextResponse.next();
  }

  // Token is valid, proceed
  console.log("Valid token for:", pathname);
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
