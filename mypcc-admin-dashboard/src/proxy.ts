import { NextRequest, NextResponse } from "next/server";

// ─── Simple, fast proxy — NO withAuth, NO external calls ─────────────────────
// Reads the session cookie directly. Cookie existence = valid session
// (NextAuth validates the JWT on actual API calls).
// This proxy only handles admin route protection, not login redirects.
export default function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Check for session cookie (supports both http and https)
    const hasSession =
        req.cookies.has("next-auth.session-token") ||
        req.cookies.has("__Secure-next-auth.session-token");

    // Unauthenticated user trying to access admin → send to login
    if (path.startsWith("/admin") && !hasSession) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // No redirect for logged-in users visiting /auth/login or /auth/register.
    // The login page itself handles role-based redirects (admin vs user) after credential check.

    return NextResponse.next();
}

// Only run on admin paths — NOT on API routes or static assets
export const config = {
    matcher: ["/admin/:path*"],
};
