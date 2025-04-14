import { NextResponse, NextRequest } from "next/server";
import { getCurrentSession } from "./lib/auth";

/**
 * The middleware function checks the session and URL path to handle redirection in a Next.js
 * application.
 * @param {NextRequest} request - The `request` parameter in the `middleware` function is of type
 * `NextRequest`, which likely represents the incoming request to the server. It contains information
 * about the request such as the URL, headers, method, and other request details.
 * @returns The `middleware` function returns a `NextResponse` object with a redirect to a specific URL
 * based on certain conditions. If the session is not present and the request path starts with
 * "/requests", it redirects to the root URL. If the session is present and the request path is "/", it
 * redirects to "/requests". If there is an error during the process, it catches the error, logs it,
 */
export async function middleware(request: NextRequest) {
  try {
    const session = getCurrentSession(request);

    if (!session && request.nextUrl.pathname.startsWith("/requests")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (session && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/requests", request.url));
    }
  } catch (error) {
    console.error("Error en middleware:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/requests/:path*", "/"],
};
