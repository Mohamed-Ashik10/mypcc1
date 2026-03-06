import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getAdminStats() {
    try {
        const [users, hymns, diaryEntries, subscriptions, transactions] = await Promise.all([
            prisma.user.count(),
            prisma.hymn.count(),
            prisma.diaryEntry.count(),
            prisma.subscription.count({ where: { status: "ACTIVE" } }),
            prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
        ]);
        return { users, hymns, diaryEntries, subscriptions, totalRevenue: transactions._sum.amount ?? 0, error: null };
    } catch (err: any) {
        console.error("[AdminDashboard] DB error:", err?.message);
        return { users: 0, hymns: 0, diaryEntries: 0, subscriptions: 0, totalRevenue: 0, error: err?.message ?? "Database unavailable" };
    }
}

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const userId = (session?.user as any)?.id;
    const userName = session?.user?.name || "Member";

    const isAdmin = ["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole.toUpperCase());

    if (isAdmin) {
        const stats = await getAdminStats();

        const statCards = [
            { label: "Total Members", key: "users", icon: "👥", gradient: "from-[#6c47ff] to-[#a855f7]", glow: "rgba(108,71,255,0.3)", href: "/admin/users" },
            { label: "Total Hymns", key: "hymns", icon: "🎵", gradient: "from-[#a855f7] to-[#c084fc]", glow: "rgba(168,85,247,0.3)", href: "/admin/hymns" },
            { label: "Diary Entries", key: "diaryEntries", icon: "📖", gradient: "from-[#06b6d4] to-[#0284c7]", glow: "rgba(6,182,212,0.3)", href: "/admin/diary" },
            { label: "Active Subs", key: "subscriptions", icon: "💳", gradient: "from-[#f59e0b] to-[#d97706]", glow: "rgba(245,158,11,0.3)", href: "/admin/subscriptions" },
        ];

        const quickActions = [
            { label: "Add Hymn", href: "/admin/hymns/new", icon: "🎵" },
            { label: "New Diary Entry", href: "/admin/diary/new", icon: "✍️" },
            { label: "Upload Echo", href: "/admin/the-echo/new", icon: "📰" },
            { label: "Announcement", href: "/admin/announcements/new", icon: "📢" },
        ];

        return (
            <div className="space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h2>
                        <p className="text-sm text-white/40 mt-1">
                            Welcome back, <span className="text-[#a855f7] font-semibold">{userName}</span>! Here&apos;s the state of the platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full">
                        <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                        <span className="text-[11px] font-semibold text-[#10b981] tracking-widest uppercase">System Live</span>
                    </div>
                </div>

                {/* DB Error Banner */}
                {stats.error && (
                    <div className="bg-red-900/20 border border-red-500/30 text-red-300 rounded-2xl px-6 py-4 text-sm font-medium flex items-start gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-bold text-red-200">Database Unavailable</p>
                            <p className="text-red-300/70 text-xs mt-1">Cannot reach the database server. Stats show cached zeros.<br /><span className="opacity-50 font-mono">{stats.error}</span></p>
                        </div>
                    </div>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card) => (
                        <Link key={card.key} href={card.href}>
                            <div
                                className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-5 cursor-pointer group transition-all hover:-translate-y-1 hover:border-white/15"
                                style={{ background: "rgba(17,17,39,0.9)" }}
                            >
                                {/* Glow */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                                    style={{ background: `radial-gradient(ellipse at top right, ${card.glow} 0%, transparent 65%)` }}
                                />
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-lg mb-4 shadow-lg`}>
                                    {card.icon}
                                </div>
                                {/* Value */}
                                <p className="text-2xl font-bold text-white mb-1">
                                    {(stats as any)[card.key].toLocaleString()}
                                </p>
                                <p className="text-xs font-medium text-white/40 uppercase tracking-widest">{card.label}</p>
                                {/* Bottom bar */}
                                <div className="mt-4 h-[2px] bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`} style={{ width: "70%" }} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Revenue Banner */}
                <div
                    className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-7 flex flex-col md:flex-row items-center justify-between gap-6"
                    style={{ background: "linear-gradient(135deg,#0f0f22 0%,#1a1333 100%)" }}
                >
                    {/* Glow orb */}
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#6c47ff]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-[#06b6d4]/8 rounded-full blur-3xl pointer-events-none" />

                    <div className="z-10">
                        <p className="text-[10px] font-bold text-[#a855f7] uppercase tracking-[0.3em] mb-2">Platform Revenue (Total)</p>
                        <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            {stats.totalRevenue.toLocaleString("fr-CM", { style: "currency", currency: "XAF" })}
                        </p>
                        <p className="text-white/30 text-sm mt-2">Accumulated from completed transactions</p>
                    </div>
                    <div
                        className="z-10 rounded-xl px-8 py-5 text-center border border-white/10 min-w-[180px] group-hover:scale-105 transition-transform"
                        style={{ background: "rgba(108,71,255,0.12)" }}
                    >
                        <p className="text-[10px] font-bold text-[#a855f7] uppercase tracking-widest mb-1">Status</p>
                        <p className="text-2xl font-black text-white">Stable</p>
                        <p className="text-[10px] text-white/30 mt-1">Last 30 days</p>
                    </div>
                </div>

                {/* Quick Actions + Activity Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Quick Actions */}
                    <div
                        className="rounded-2xl border border-white/[0.08] p-6"
                        style={{ background: "rgba(17,17,39,0.9)" }}
                    >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">Quick Actions</p>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action) => (
                                <Link key={action.href} href={action.href}>
                                    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-[#6c47ff]/10 hover:border-[#6c47ff]/30 transition-all cursor-pointer group">
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                        <span className="text-xs font-semibold text-white/50 group-hover:text-white/90 transition-colors text-center">{action.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Role Breakdown */}
                    <div
                        className="rounded-2xl border border-white/[0.08] p-6"
                        style={{ background: "rgba(17,17,39,0.9)" }}
                    >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">Platform Summary</p>
                        <div className="space-y-4">
                            {[
                                { label: "Members", value: stats.users, max: Math.max(stats.users, 1), color: "from-[#6c47ff] to-[#a855f7]" },
                                { label: "Hymns Published", value: stats.hymns, max: Math.max(stats.hymns, 1), color: "from-[#a855f7] to-[#c084fc]" },
                                { label: "Diary Entries", value: stats.diaryEntries, max: Math.max(stats.diaryEntries, 1), color: "from-[#06b6d4] to-[#22d3ee]" },
                                { label: "Active Subscriptions", value: stats.subscriptions, max: Math.max(stats.subscriptions, 1), color: "from-[#f59e0b] to-[#fbbf24]" },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-xs text-white/50">{item.label}</span>
                                        <span className="text-xs font-bold text-white">{item.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                                            style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    // ── MEMBER VIEW ────────────────────────────────────────────────────────
    let todayReading = null;
    let activeSub = null;
    try {
        [todayReading, activeSub] = await Promise.all([
            prisma.diaryEntry.findFirst({
                where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lt: new Date(new Date().setHours(23, 59, 59, 999)) } }
            }),
            prisma.subscription.findFirst({
                where: { userId, status: "ACTIVE" }
            })
        ]);
    } catch (err: any) {
        console.error("[MemberDashboard] DB error:", err?.message);
    }

    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight italic">Shalom, {userName.split(' ')[0]}!</h2>
                    <p className="text-sm text-white/40 mt-1">Welcome to your My PCC spiritual portal.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/[0.08] self-start md:self-auto" style={{ background: "rgba(17,17,39,0.9)" }}>
                    <span className="text-2xl animate-pulse">📅</span>
                    <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">Today is</p>
                        <p className="text-sm font-bold text-white">{new Date().toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Spiritual Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Reading */}
                    <div className="relative overflow-hidden rounded-2xl p-8 text-white min-h-[280px] flex flex-col justify-end border border-white/10"
                        style={{ background: "linear-gradient(135deg,#3b1fa8 0%,#1e1080 100%)" }}>
                        <div className="absolute top-8 left-8">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#a855f7]/80 py-1 px-3 border border-[#a855f7]/30 rounded-full">Daily Spiritual Bread</span>
                        </div>
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            {todayReading ? (
                                <>
                                    <h3 className="text-2xl sm:text-3xl font-black leading-tight italic">&ldquo;{todayReading.title || "Daily Word"}&rdquo;</h3>
                                    {todayReading.theme && <p className="text-[#c084fc]/70 text-sm font-medium italic">Theme: {todayReading.theme}</p>}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {[todayReading.readingOne, todayReading.readingTwo, todayReading.readingThree].filter(Boolean).map((r, i) => (
                                            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 font-bold text-xs">
                                                📜 {r}
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/admin/diary" className="inline-flex items-center gap-2 mt-4 font-bold text-sm text-[#c084fc] hover:text-white transition-colors">
                                        Read Full Scripture →
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-xl font-bold opacity-60">Seek and ye shall find...</p>
                                    <p className="text-sm opacity-40 mt-1">No reading scheduled for today.</p>
                                    <Link href="/admin/diary" className="mt-4 inline-block text-[#c084fc] underline text-sm">Open Church Diary</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Nav */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { href: "/admin/hymns", icon: "🎵", title: "Hymn Book", sub: "Lyrics & Praise" },
                            { href: "/admin/the-echo", icon: "📰", title: "The Echo", sub: "Church News" },
                        ].map(item => (
                            <Link key={item.href} href={item.href}>
                                <div className="rounded-2xl p-6 border border-white/[0.08] hover:-translate-y-1 hover:border-[#6c47ff]/30 transition-all cursor-pointer group relative overflow-hidden"
                                    style={{ background: "rgba(17,17,39,0.9)" }}>
                                    <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                                    <h4 className="font-black text-white">{item.title}</h4>
                                    <p className="text-xs text-white/40 mt-1">{item.sub}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right: Membership */}
                <div className="space-y-5">
                    {/* Subscription */}
                    <div className={`rounded-2xl p-6 space-y-5 border relative overflow-hidden ${activeSub ? "border-[#10b981]/20" : "border-[#f59e0b]/20"}`}
                        style={{ background: activeSub ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)" }}>
                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                            style={{ background: activeSub ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)" }} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Membership Status</h3>
                        <div>
                            {activeSub ? (
                                <>
                                    <p className="text-3xl font-black text-white leading-none">{activeSub.type.replace(/_/g, ' ')}</p>
                                    <p className="text-xs font-bold text-[#10b981]/70 mt-2 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                                        Until {new Date(activeSub.endDate).toLocaleDateString("en-GB", { month: 'short', year: 'numeric' })}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-3xl font-black text-white leading-none">FREE</p>
                                    <p className="text-xs text-white/40 mt-2 leading-relaxed">Upgrade to Premium for exclusive Echo content.</p>
                                </>
                            )}
                        </div>
                        <Link href="/admin/subscriptions"
                            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center block transition-all active:scale-95 ${activeSub ? "bg-[#10b981] text-white" : "bg-[#f59e0b] text-white"}`}>
                            {activeSub ? "Manage Subscription" : "Upgrade to Premium"}
                        </Link>
                    </div>

                    {/* Announcements */}
                    <div className="rounded-2xl p-5 border border-white/[0.08]" style={{ background: "rgba(17,17,39,0.9)" }}>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-9 h-9 bg-[#6c47ff]/15 rounded-xl flex items-center justify-center text-lg">📢</span>
                            <h4 className="font-black text-white">Announcements</h4>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Check <Link href="/admin/announcements" className="text-[#a855f7] font-bold hover:text-[#c084fc] transition-colors">Announcements</Link> for important church updates and events.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
