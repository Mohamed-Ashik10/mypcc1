import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
    const [users, hymns, diaryEntries, subscriptions, transactions] = await Promise.all([
        prisma.user.count(),
        prisma.hymn.count(),
        prisma.diaryEntry.count(),
        prisma.subscription.count({ where: { status: "ACTIVE" } }),
        prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    ]);
    return { users, hymns, diaryEntries, subscriptions, totalRevenue: transactions._sum.amount ?? 0 };
}

const statCards = [
    { label: "Total Members", key: "users", icon: "👥", color: "bg-blue-500", href: "/admin/users" },
    { label: "Hymns", key: "hymns", icon: "🎵", color: "bg-purple-500", href: "/admin/hymns" },
    { label: "Diary Entries", key: "diaryEntries", icon: "📖", color: "bg-green-500", href: "/admin/diary" },
    { label: "Active Subscriptions", key: "subscriptions", icon: "💳", color: "bg-orange-500", href: "/admin/subscriptions" },
];

export default async function AdminDashboardPage() {
    const stats = await getStats();

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">Overview</h2>
                <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with My PCC.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card) => (
                    <Link key={card.key} href={card.href}>
                        <div className="bg-card text-card-foreground rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer border border-border">
                            <div className={`${card.color} text-white text-2xl p-3 rounded-xl shadow-inner`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{card.label}</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {stats[card.key as keyof typeof stats].toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Revenue Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-2xl shadow-lg p-6 text-white mb-10">
                <p className="text-sm text-blue-100/80">Total Revenue (Completed Transactions)</p>
                <p className="text-4xl font-bold mt-1">
                    {stats.totalRevenue.toLocaleString("fr-CM", { style: "currency", currency: "XAF" })}
                </p>
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 opacity-90">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Add Hymn", href: "/admin/hymns/new", icon: "➕" },
                        { label: "Add Diary Entry", href: "/admin/diary/new", icon: "📝" },
                        { label: "Upload The Echo", href: "/admin/the-echo/new", icon: "📤" },
                        { label: "Post Announcement", href: "/admin/announcements/new", icon: "📢" },
                    ].map((action) => (
                        <Link key={action.href} href={action.href}>
                            <div className="bg-card border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                                <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">{action.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
