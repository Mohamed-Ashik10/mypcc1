import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN_STAFF", "ADMIN_STAFF", "CONTENT_EDITOR"];

export default withAuth(
    function proxy(req) {
        const path = req.nextUrl.pathname;
        const role = req.nextauth.token?.role as string;

        // Block non-admin roles from accessing /admin routes → redirect to landing page
        if (path.startsWith("/admin") && !ADMIN_ROLES.includes(role)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // If already logged in and visiting the login page, redirect to appropriate home
        if (path === "/auth/login" && role) {
            if (ADMIN_ROLES.includes(role)) {
                return NextResponse.redirect(new URL("/admin", req.url));
            } else {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;

                // Public paths — no token required
                const publicPaths = [
                    "/",
                    "/auth/login",
                    "/auth/register",
                    "/auth/reset-password",
                    "/api/auth",
                ];
                const isPublicPath = publicPaths.some(
                    (p) => path === p || path.startsWith(p)
                );

                if (isPublicPath) return true;

                // All other routes require a valid session token
                return !!token;
            },
        },
    }
);

// Protect all routes except static assets and Next.js internals
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|\\.png|\\.jpg|\\.svg|\\.gif|canticle_logic).*)"],
};
