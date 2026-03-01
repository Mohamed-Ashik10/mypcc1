import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const path = req.nextUrl.pathname;
        const role = req.nextauth.token?.role as string;

        const adminRoles = ["SUPER_ADMIN", "ADMIN", "STAFF", "EDITOR"];

        // If trying to access /admin and not an admin role, kick them back to user dashboard/home
        if (path.startsWith("/admin") && !adminRoles.includes(role)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Standard users should be funneled to dashboard if they try to hit login again
        if ((path === "/auth/user-login" || path === "/auth/admin-login") && role) {
            if (adminRoles.includes(role)) {
                return NextResponse.redirect(new URL("/admin", req.url));
            } else {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Anyone can visit the homepage and auth pages
                const publicPaths = ["/", "/auth/user-login", "/auth/admin-login", "/auth/register", "/api/auth"];
                const isPublicPath = publicPaths.some(p => req.nextUrl.pathname === p || req.nextUrl.pathname.startsWith(p));

                if (isPublicPath) return true;

                // Everything else requires at least some kind of login token
                return !!token;
            }
        }
    }
);

// Matcher protects all routes EXCEPT static assets, api endpoints (which verify tokens themselves), public images, and next.js internals
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|\\.png|\\.jpg|\\.svg|\\.gif|canticle_logic).*)"]
};
