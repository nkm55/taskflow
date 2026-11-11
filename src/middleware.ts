import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

// A fast, optimistic check: no cookie means definitely signed out, so redirect early.
// The real check (is the session valid in the DB?) happens in requireUser() on the server,
// because middleware runs on the Edge and can't query Postgres through Prisma.
export function middleware(req: NextRequest) {
  if (!req.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
