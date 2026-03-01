import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ResponsiveSidebar } from "@/components/ResponsiveSidebar";

export const metadata: Metadata = {
    title: "My PCC Admin Dashboard",
    description: "Presbyterian Church in Cameroon – Admin Panel",
};

const navLinks = [
    { href: "/admin", label: "Dashboard", icon: "📊", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"] },
    { href: "/admin/hymns", label: "Hymns", icon: "🎵", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"] },
    { href: "/admin/diary", label: "Church Diary", icon: "📖", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"] },
    { href: "/admin/the-echo", label: "The Echo", icon: "📰", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"] },
    { href: "/admin/devotionals", label: "Devotionals", icon: "🙏", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"] },
    { href: "/admin/users", label: "Users", icon: "👥", roles: ["SUPER_ADMIN"] },
    { href: "/admin/user-logs", label: "User Logs", icon: "🔐", roles: ["SUPER_ADMIN"] },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: "💳", roles: ["SUPER_ADMIN", "ADMIN", "USER"] },
    { href: "/admin/transactions", label: "Transactions", icon: "💰", roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/admin/announcements", label: "Announcements", icon: "📢", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
    { href: "/admin/pcc-info", label: "PCC Info", icon: "ℹ️", roles: ["SUPER_ADMIN", "ADMIN"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    const userRole = (session.user as any)?.role || "USER";

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background dark:bg-background text-foreground transition-colors duration-300 overflow-hidden">
            <ResponsiveSidebar navLinks={navLinks} userRole={userRole} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
