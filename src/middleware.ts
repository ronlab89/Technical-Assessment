import { NextResponse, NextRequest } from "next/server";
import { getCurrentSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const session = getCurrentSession(request);

    // Si no hay sesión y el usuario intenta acceder al dashboard, redirige al login
    if (!session && request.nextUrl.pathname.startsWith("/requests")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Si hay sesión y el usuario está en la página de login, redirige al dashboard
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
