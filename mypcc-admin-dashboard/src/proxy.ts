import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"];

// ─── Simple, fast proxy — NO withAuth, NO external calls ─────────────────────
// Reads the session cookie directly. Cookie existence = valid session
// (NextAuth validates the JWT on actual API calls).
// This proxy only handles redirects, not security enforcement.
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

    // Logged-in user visiting login page → send to admin
    if (path === "/auth/login" && hasSession) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
}

// Only run on admin and auth paths — NOT on API routes or static assets
export const config = {
    matcher: ["/admin/:path*", "/auth/login"],
};
