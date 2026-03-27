import { fetchFromBackend } from "@/lib/api";
import type { Metadata } from "next";
import { ResponsiveSidebar } from "@/components/ResponsiveSidebar";
import { DynamicThemeProvider } from "@/components/DynamicThemeProvider";
import { AdminTopBar } from "@/components/AdminTopBar";

export const metadata: Metadata = {
    title: "Canticle Admin Dashboard",
    description: "Presbyterian Church in Cameroon – Admin Panel",
};

const navLinks = [
    { href: "/admin",               label: "Dashboard Overview",       icon: "LayoutDashboard", roles: ["SUPER_ADMIN","ADMIN_STAFF","CONTENT_EDITOR","CHURCH_USER","NORMAL_USER"] },
    { href: "/admin/hymns",         label: "Hymntal Library",          icon: "Music",           roles: ["SUPER_ADMIN","ADMIN_STAFF","CONTENT_EDITOR","CHURCH_USER","NORMAL_USER"] },
    { href: "/admin/diary",         label: "Church Diary",             icon: "Book",            roles: ["SUPER_ADMIN","ADMIN_STAFF","CONTENT_EDITOR","CHURCH_USER","NORMAL_USER"] },
    { href: "/admin/the-echo",      label: "Echo Newsletter",          icon: "Newspaper",       roles: ["SUPER_ADMIN","ADMIN_STAFF","CONTENT_EDITOR","CHURCH_USER","NORMAL_USER"] },
    { href: "/admin/devotionals",   label: "Daily Manna",              icon: "Bird",            roles: ["SUPER_ADMIN","ADMIN_STAFF","CONTENT_EDITOR","CHURCH_USER","NORMAL_USER"] },
    { href: "/admin/users",         label: "Account Control",          icon: "Users",           roles: ["SUPER_ADMIN"] },
    { href: "/admin/user-logs",     label: "Access Vault",             icon: "ShieldAlert",     roles: ["SUPER_ADMIN"] },
    { href: "/admin/subscriptions", label: "Member Tiers",             icon: "CreditCard",      roles: ["SUPER_ADMIN","ADMIN_STAFF","CHURCH_USER","NORMAL_USER"] },
    { href: "/admin/transactions",  label: "Ministry Ledger",          icon: "DollarSign",      roles: ["SUPER_ADMIN","ADMIN_STAFF"] },
    { href: "/admin/announcements", label: "Direct Broadcast",         icon: "Megaphone",       roles: ["SUPER_ADMIN","ADMIN_STAFF","CONTENT_EDITOR"] },
    { href: "/admin/testimonials",  label: "Voices of Faith",          icon: "MessageCircle",   roles: ["SUPER_ADMIN","ADMIN_STAFF","CONTENT_EDITOR"] },
    { href: "/admin/pcc-info",      label: "PCC Official Info",        icon: "Info",            roles: ["SUPER_ADMIN","ADMIN_STAFF"] },
    { href: "/admin/settings",      label: "System Core",              icon: "Settings",        roles: ["SUPER_ADMIN","ADMIN_STAFF"] },
    { href: "http://localhost:8080/swagger-ui/index.html", label: "Backend Engine (Swagger)", icon: "ShieldAlert", roles: ["SUPER_ADMIN"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. Fetch settings from backend
    let sideTitle = "Canticle";
    let sideLogo = "/logo.png";

    try {
        const settings = await fetchFromBackend<any>("/api/admin/settings", { revalidate: 3600 });
        if (settings) {
            if (settings.sidebar_title) sideTitle = settings.sidebar_title;
            else if (settings.app_name) sideTitle = settings.app_name; // Fallback
            
            if (settings.logo_admin) sideLogo = settings.logo_admin;
        }
    } catch (err) {
        console.error("Layout context fetch failed", err);
    }

    const defaultTheme = "--primary: 283 74% 35%; --primary-foreground: 210 40% 98%; --accent: 255 0% 96%;";

    return (
        <div className="flex h-screen overflow-hidden bg-background font-sans selection:bg-primary/10 selection:text-primary">
            <DynamicThemeProvider initialStyles={defaultTheme} />

            {/* Sidebar — role shown client-side via useSession in ResponsiveSidebar */}
            <ResponsiveSidebar
                navLinks={navLinks}
                userRole="SUPER_ADMIN"
                appName={sideTitle}
                logoAdmin={sideLogo}
            />

            <div className="flex-1 flex flex-col h-full lg:pl-[260px] pt-16 lg:pt-0 relative">
                {/* Top bar — user name/role from client-side useSession */}
                <AdminTopBar />

                <main className="flex-1 overflow-y-auto lg:pt-4 scrollbar-hide">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
