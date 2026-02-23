import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "My PCC Admin Dashboard",
    description: "Presbyterian Church in Cameroon – Admin Panel",
};

const navLinks = [
    { href: "/admin", label: "Dashboard", icon: "📊", roles: ["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR", "MEMBER"] },
    { href: "/admin/hymns", label: "Hymns", icon: "🎵", roles: ["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR", "MEMBER"] },
    { href: "/admin/diary", label: "Church Diary", icon: "📖", roles: ["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR", "MEMBER"] },
    { href: "/admin/the-echo", label: "The Echo", icon: "📰", roles: ["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR", "MEMBER"] },
    { href: "/admin/devotionals", label: "Devotionals", icon: "🙏", roles: ["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR", "MEMBER"] },
    { href: "/admin/users", label: "Users", icon: "👥", roles: ["ADMIN", "SUPER_ADMIN"] },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: "💳", roles: ["ADMIN", "SUPER_ADMIN", "STAFF", "MEMBER"] },
    { href: "/admin/transactions", label: "Transactions", icon: "💰", roles: ["ADMIN", "SUPER_ADMIN", "STAFF"] },
    { href: "/admin/announcements", label: "Announcements", icon: "📢", roles: ["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR"] },
    { href: "/admin/pcc-info", label: "PCC Info", icon: "ℹ️", roles: ["ADMIN", "SUPER_ADMIN", "STAFF"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    const userRole = (session.user as any)?.role || "MEMBER";

    return (
        <div className="flex h-screen bg-background dark:bg-background text-foreground transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 dark:bg-slate-900 border-r border-border text-white flex flex-col shadow-2xl">
                <div className="px-6 py-5 border-b border-blue-800 dark:border-slate-800">
                    <h1 className="text-xl font-bold tracking-wide">✝ My PCC</h1>
                    <p className="text-xs text-blue-300 dark:text-slate-400 mt-1">
                        {userRole === "MEMBER" ? "Member Portal" : "Admin Dashboard"}
                    </p>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {navLinks
                            .filter((link) => link.roles.includes(userRole))
                            .map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 dark:text-slate-300 hover:bg-blue-700 dark:hover:bg-slate-800 hover:text-white transition-colors"
                                    >
                                        <span className="text-base">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-blue-800 dark:border-slate-800 space-y-4">
                    <div className="flex justify-center">
                        <ThemeToggle />
                    </div>
                    <form action="/api/auth/signout" method="POST">
                        <button
                            type="submit"
                            className="w-full text-center text-sm text-blue-300 dark:text-slate-400 hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
