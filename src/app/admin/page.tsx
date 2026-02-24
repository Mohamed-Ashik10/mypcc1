import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getAdminStats() {
    const [users, hymns, diaryEntries, subscriptions, transactions] = await Promise.all([
        prisma.user.count(),
        prisma.hymn.count(),
        prisma.diaryEntry.count(),
        prisma.subscription.count({ where: { status: "ACTIVE" } }),
        prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    ]);
    return { users, hymns, diaryEntries, subscriptions, totalRevenue: transactions._sum.amount ?? 0 };
}

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "MEMBER";
    const userId = (session?.user as any)?.id;
    const userName = session?.user?.name || "Member";

    const isAdmin = ["ADMIN", "SUPER_ADMIN", "STAFF"].includes(userRole);

    if (isAdmin) {
        const stats = await getAdminStats();

        const statCards = [
            { label: "Total Members", key: "users", icon: "👥", color: "from-blue-500 to-blue-600", href: "/admin/users" },
            { label: "Total Hymns", key: "hymns", icon: "🎵", color: "from-purple-500 to-purple-600", href: "/admin/hymns" },
            { label: "Diary Entries", key: "diaryEntries", icon: "📖", color: "from-emerald-500 to-emerald-600", href: "/admin/diary" },
            { label: "Active Subs", key: "subscriptions", icon: "💳", color: "from-orange-500 to-orange-600", href: "/admin/subscriptions" },
        ];

        return (
            <div className="space-y-10">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Overview</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">Welcome back, {userName}! Here's the state of the platform.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => (
                        <Link key={card.key} href={card.href}>
                            <div className="bg-card text-card-foreground rounded-3xl shadow-sm p-6 flex items-center gap-5 hover:shadow-xl hover:translate-y-[-4px] transition-all cursor-pointer border border-border group relative overflow-hidden">
                                <div className={`bg-gradient-to-br ${card.color} text-white text-3xl p-4 rounded-2xl shadow-lg ring-4 ring-white/10 dark:ring-black/10 group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                                <div className="z-10">
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{card.label}</p>
                                    <p className="text-3xl font-black text-foreground mt-0.5">
                                        {(stats as any)[card.key].toLocaleString()}
                                    </p>
                                </div>
                                <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-8xl group-hover:scale-125 transition-transform">
                                    {card.icon}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Revenue Banner */}
                <div className="bg-slate-900 border border-white/5 rounded-[40px] shadow-2xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
                    <div className="z-10 text-center md:text-left">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Platform Revenue</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
                            {stats.totalRevenue.toLocaleString("fr-CM", { style: "currency", currency: "XAF" })}
                        </p>
                        <p className="text-blue-100/40 text-xs sm:text-sm mt-2 font-medium">Accumulated from completed internal transactions</p>
                    </div>
                    <div className="z-10 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center min-w-[200px] group-hover:scale-105 transition-transform">
                        <p className="text-xs font-black text-blue-200 uppercase tracking-widest mb-1">Growth</p>
                        <p className="text-3xl font-black text-blue-400">Stable</p>
                        <p className="text-[10px] text-blue-100/40 italic">Last 30 Days</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6 ml-1">Admin Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {[
                            { label: "Add Hymn", href: "/admin/hymns/new", icon: "🎵", color: "text-purple-500" },
                            { label: "New Diary Entry", href: "/admin/diary/new", icon: "📝", color: "text-emerald-500" },
                            { label: "Upload Echo", href: "/admin/the-echo/new", icon: "📰", color: "text-blue-500" },
                            { label: "Announcement", href: "/admin/announcements/new", icon: "📢", color: "text-orange-500" },
                        ].map((action) => (
                            <Link key={action.href} href={action.href}>
                                <div className="bg-card border-2 border-dashed border-border rounded-3xl p-6 text-center hover:border-blue-500 hover:bg-blue-500/[0.02] hover:shadow-lg transition-all cursor-pointer group">
                                    <div className={`${action.color} text-4xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform text-center flex justify-center`}>
                                        <span dangerouslySetInnerHTML={{ __html: action.icon === "📝" ? "✍️" : action.icon }} />
                                    </div>
                                    <p className="text-sm font-black text-muted-foreground group-hover:text-foreground">{action.label}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── MEMBER VIEW ──────────────────────────────────────────────────────────
    const [todayReading, activeSub] = await Promise.all([
        prisma.diaryEntry.findFirst({
            where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lt: new Date(new Date().setHours(23, 59, 59, 999)) } }
        }),
        prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE" }
        })
    ]);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight italic">Shalom, {userName.split(' ')[0]}!</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1 text-lg font-medium">Welcome to your My PCC spiritual portal.</p>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl shadow-sm self-start md:self-auto">
                    <span className="text-2xl animate-pulse">📅</span>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Today is</p>
                        <p className="text-sm font-bold text-foreground">{new Date().toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Spiritual Food */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Today's Reading Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-end">
                        <div className="absolute top-8 left-8">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-200 py-1 px-3 border border-blue-200/30 rounded-full">Daily Spiritual Bread</span>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />

                        <div className="relative z-10 space-y-4">
                            {todayReading ? (
                                <>
                                    <h3 className="text-2xl sm:text-3xl font-black leading-tight italic">"{todayReading.title || "Daily Word"}"</h3>
                                    {todayReading.theme && <p className="text-blue-100/60 text-sm sm:text-base font-medium italic">Theme: {todayReading.theme}</p>}
                                    <div className="flex flex-wrap gap-2 sm:gap-3 pt-4">
                                        {[todayReading.readingOne, todayReading.readingTwo, todayReading.readingThree].filter(Boolean).map((r, i) => (
                                            <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 sm:px-5 sm:py-3 border border-white/20 font-bold text-xs sm:text-sm">
                                                📜 {r}
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href="/admin/diary"
                                        className="inline-flex items-center gap-2 mt-6 font-black text-sm text-blue-200 hover:text-white transition-colors"
                                    >
                                        Read Full Scripture →
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-2xl font-bold opacity-60">Seek and ye shall find...</p>
                                    <p className="text-sm opacity-40 mt-1">No reading scheduled for today. Check the diary for more.</p>
                                    <Link href="/admin/diary" className="mt-4 inline-block text-blue-200 underline text-sm">Open Church Diary</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <Link href="/admin/hymns">
                            <div className="bg-card border border-border rounded-3xl p-6 hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden relative">
                                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">🎵</span>
                                <h4 className="font-black text-foreground">Hymn Book</h4>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">Lyrics & Praise</p>
                                <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-7xl font-black italic">SING</div>
                            </div>
                        </Link>
                        <Link href="/admin/the-echo">
                            <div className="bg-card border border-border rounded-3xl p-6 hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden relative">
                                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">📰</span>
                                <h4 className="font-black text-foreground">The Echo</h4>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">Church News</p>
                                <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-7xl font-black italic">NEWS</div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right: Membership & Info */}
                <div className="space-y-8">
                    {/* Subscription Widget */}
                    <div className={`rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl ${activeSub ? "bg-emerald-600 text-white" : "bg-orange-600 text-white"}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Membership Status</h3>

                        <div>
                            {activeSub ? (
                                <>
                                    <p className="text-3xl font-black leading-none">{activeSub.type.replace(/_/g, ' ')}</p>
                                    <p className="text-xs font-bold text-emerald-100/60 mt-2 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-200 rounded-full animate-pulse" />
                                        Valid until {new Date(activeSub.endDate).toLocaleDateString("en-GB", { month: 'short', year: 'numeric' })}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-3xl font-black leading-none">FREE</p>
                                    <p className="text-xs font-bold text-orange-100/60 mt-3 leading-relaxed">
                                        Upgrade to Premium to access all Echo news and exclusive content.
                                    </p>
                                </>
                            )}
                        </div>

                        <Link
                            href="/admin/subscriptions"
                            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center block shadow-lg transition-all active:scale-95 ${activeSub ? "bg-white text-emerald-600" : "bg-white text-orange-600"}`}
                        >
                            {activeSub ? "Manage Subscription" : "Upgrade to Premium"}
                        </Link>
                    </div>

                    {/* Announcement Tip */}
                    <div className="bg-card border border-border rounded-[32px] p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl">📢</span>
                            <h4 className="font-black text-foreground">Announcements</h4>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Check the <Link href="/admin/announcements" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Announcements</Link> section for important church updates and events.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
