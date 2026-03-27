import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
    Users, Music, CreditCard, DollarSign,
    TrendingUp, BarChart3, Activity, Settings
} from "lucide-react";
import { fetchFromBackend } from "@/lib/api";

export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma"; // Direct DB Fallback

// ─── Stats fetcher (runs async, inside Suspense) ──────────────────────────────
async function StatCards() {
    let stats = { users: 0, hymns: 0, subscriptions: 0, totalRevenue: 0 };
    try {
        const data = await fetchFromBackend<any>("/api/admin/dashboard/stats");
        stats = { ...stats, ...data };
    } catch (err) {
        console.error("Dashboard Stats fetch failed. Using Prisma Fallback.", err);
        try {
            const [userCount, hymnCount, subCount, transactions] = await Promise.all([
                prisma.user.count(),
                prisma.hymn.count(),
                prisma.subscription.count({ where: { status: "ACTIVE" } }),
                prisma.transaction.findMany({ where: { status: "COMPLETED" }, select: { amount: true } })
            ]);
            
            const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
            
            stats = {
                users: userCount,
                hymns: hymnCount,
                subscriptions: subCount,
                totalRevenue: totalRevenue
            };
        } catch (dbErr) {
            console.error("Dashboard Stats DB Fallback failed.", dbErr);
        }
    }

    const cards = [
        { label: "Total Members",  value: stats.users,                                    icon: <Users size={22} />,      color: "bg-[#7367f0]/10 text-[#7367f0]", href: "/admin/users" },
        { label: "Active Hymns",   value: stats.hymns,                                    icon: <Music size={22} />,      color: "bg-[#00cfe8]/10 text-[#00cfe8]", href: "/admin/hymns" },
        { label: "Valid Subs",     value: stats.subscriptions,                            icon: <CreditCard size={22} />, color: "bg-[#28c76f]/10 text-[#28c76f]", href: "/admin/subscriptions" },
        { label: "Ministry Rev",   value: Number(stats.totalRevenue).toLocaleString() + " XAF", icon: <DollarSign size={22} />, color: "bg-[#ff9f43]/10 text-[#ff9f43]", href: "/admin/transactions" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
                <Link key={i} href={card.href} className="bg-white rounded-2xl p-6 border border-[#dbdade]/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                            {card.icon}
                        </div>
                        <div>
                            <h4 className="text-[20px] font-black text-[#5d596c] leading-none mb-1">{card.value}</h4>
                            <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-wider">{card.label}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

// ─── Skeleton shown while stats load ─────────────────────────────────────────
function StatCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-[#dbdade]/50 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100" />
                    <div className="space-y-2">
                        <div className="h-6 w-14 bg-slate-200 rounded" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main page — renders INSTANTLY, stats stream in ───────────────────────────
export default async function AdminDashboardPage() {
    // JWT decode only — no DB call
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "SUPER_ADMIN";
    const userName = session?.user?.name || "Member";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* ── WELCOME SECTION ─────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-[#dbdade]/50 relative overflow-hidden shadow-sm flex flex-col justify-center">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-primary tracking-tighter uppercase mb-2">
                            Welcome Back, {userName}! 🎉
                        </h1>
                        <p className="text-[#5d596c] opacity-70 font-medium">
                            The Canticle digital ministry is growing steadily. Here&apos;s what&apos;s happening today.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Link href="/admin/hymns/new" className="px-5 py-2.5 bg-primary text-white rounded-lg text-[11px] font-black uppercase tracking-widest shadow-md shadow-primary/30 hover:-translate-y-0.5 transition-all">Add New Hymn</Link>
                            <Link href="/admin/subscriptions" className="px-5 py-2.5 border border-[#dbdade] text-[#5d596c] rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#dbdade]/10 transition-all">Audit Ledger</Link>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent flex items-center justify-center opacity-40 pointer-events-none">
                        <Activity size={160} className="text-primary/10" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-[#dbdade]/50 shadow-sm relative overflow-hidden">
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-[#a5a3ae] mb-6">Website Analytics</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[24px] font-black text-[#5d596c] leading-none mb-1">12.4k</p>
                                <p className="text-[11px] font-bold text-[#a5a3ae] uppercase">Hymn Views (7d)</p>
                            </div>
                            <div className="text-emerald-500 flex items-center gap-1 font-black text-[11px] uppercase bg-emerald-50 px-2 py-1 rounded-md tracking-tighter">
                                <TrendingUp size={12} /> +18.2%
                            </div>
                        </div>
                        <div className="h-2 w-full bg-[#f8f7fa] rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[75%] rounded-full shadow-sm"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                            Most viewed: <span className="text-primary">Praise &amp; Worship</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── STATS — stream in while page is already visible ── */}
            <Suspense fallback={<StatCardsSkeleton />}>
                <StatCards />
            </Suspense>

            {/* ── REVENUE & DATA GRIDS ─────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-[#dbdade]/50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#a5a3ae] mb-1">Revenue Report</h3>
                            <p className="text-[22px] font-black text-[#5d596c] tracking-tighter">Total Growth</p>
                        </div>
                        <button className="p-2 border border-[#dbdade] rounded-lg text-[#5d596c] hover:bg-slate-50">
                            <Settings size={16} />
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-10 items-end">
                        <div className="flex-1 w-full h-48 bg-[#f8f7fa] rounded-2xl border border-dashed border-[#dbdade] flex flex-col items-center justify-center text-[#dbdade]">
                            <BarChart3 size={40} />
                            <p className="text-[10px] font-bold mt-4 uppercase tracking-[0.3em]">Revenue Chart Placeholder</p>
                        </div>
                        <div className="w-full md:w-1/3 space-y-6">
                            <div>
                                <p className="text-[32px] font-black text-primary tracking-tighter">Budget: 2.5M</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Yearly Ministry Goal</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-[#5d596c]">Platform Costs</span>
                                    <span className="text-[11px] font-black text-slate-500">120k</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#f8f7fa] rounded-full">
                                    <div className="h-full bg-red-400 w-[15%] rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-[#5d596c]">Net Growth</span>
                                    <span className="text-[11px] font-black text-[#28c76f]">+85%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#f8f7fa] rounded-full">
                                    <div className="h-full bg-[#28c76f] w-[85%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-[#dbdade]/50 shadow-sm flex flex-col items-center text-center">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[#a5a3ae] mb-10 w-full text-left">System Health</h3>
                    <div className="relative w-40 h-40 mb-8">
                        <div className="absolute inset-0 border-[12px] border-[#f8f7fa] rounded-full shadow-inner"></div>
                        <div className="absolute inset-0 border-[12px] border-primary rounded-full border-t-transparent border-r-transparent rotate-[30deg] shadow-lg shadow-primary/10"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-[28px] font-black text-[#5d596c] leading-none">98.4%</p>
                            <p className="text-[10px] font-bold text-[#a5a3ae] uppercase tracking-widest mt-1">Uptime</p>
                        </div>
                    </div>
                    <p className="text-[13px] font-medium text-[#5d596c] mb-2 px-2">Global Content Synchronization</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">Verified across 3 regions</p>
                    <button className="mt-8 w-full py-2.5 border border-[#dbdade] text-[#5d596c] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all">Network Status</button>
                </div>
            </div>
        </div>
    );
}
