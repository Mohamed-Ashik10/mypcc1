import { fetchFromBackend } from "@/lib/api";
import Link from "next/link";
import DiaryDeleteButton from "@/components/DiaryDeleteButton";
import DiaryFilters from "@/components/DiaryFilters";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookOpen, Plus, Calendar, Star, ShieldCheck, Clock, Edit2, Scroll, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ExternalLink } from "lucide-react";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DiaryManagementPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; month?: string; search?: string; year?: string; theme?: string }>;
}) {
    const now = new Date();
    const { page: pageStr, month: monthStr, search: searchStr, year: yearStr, theme: themeStr } = await searchParams;
    const page = parseInt(pageStr ?? "1");
    const limit = 20;

    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const isAdmin = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);
    const canModify = isAdmin;
    const search = searchStr ?? "";

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const selectedMonthIdx = monthStr ? months.indexOf(monthStr) : now.getMonth();
    const safeMonthIdx = selectedMonthIdx === -1 ? now.getMonth() : selectedMonthIdx;
    const safeYear = parseInt(yearStr || now.getFullYear().toString());

    let entries: any[] = [];
    let total = 0;
    let totalEntries = 0;
    let monthEntriesCount = 0;
    let nextEntry: any = null;

    try {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search: searchStr ?? "",
            year: safeYear.toString(),
            month: monthStr ? (safeMonthIdx + 1).toString() : ""
        }).toString();

        const data = await fetchFromBackend<any>(`/api/admin/diary?${query}`);
        entries = data.entries || [];
        total = data.total || 0;
        totalEntries = data.totalEntries || 0;
        monthEntriesCount = data.monthEntriesCount || 0;
        nextEntry = data.nextEntry;
    } catch (error) {
        console.error("Failed to fetch diary entries from backend. Using Prisma Fallback.", error);
        try {
            const skip = (page - 1) * limit;
            const where: any = { userId: null }; // Only church-wide entries
            
            if (search) {
                where.OR = [
                    { title: { contains: search } },
                    { theme: { contains: search } },
                    { readingOne: { contains: search } },
                    { readingTwo: { contains: search } },
                    { readingThree: { contains: search } }
                ];
            }
            
            if (monthStr || yearStr) {
                const start = new Date(safeYear, safeMonthIdx, 1);
                const end = new Date(safeYear, safeMonthIdx + 1, 0);
                where.date = { gte: start, lte: end };
            }

            const [dbEntries, dbTotal, dbTotalFull, dbMonthCount, dbNext] = await Promise.all([
                prisma.diaryEntry.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
                prisma.diaryEntry.count({ where }),
                prisma.diaryEntry.count({ where: { userId: null } }),
                prisma.diaryEntry.count({ 
                    where: { 
                        userId: null, 
                        date: { 
                            gte: new Date(now.getFullYear(), now.getMonth(), 1),
                            lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
                        } 
                    } 
                }),
                prisma.diaryEntry.findFirst({
                    where: { userId: null, date: { gt: now } },
                    orderBy: { date: 'asc' }
                })
            ]);

            entries = dbEntries;
            total = dbTotal;
            totalEntries = dbTotalFull;
            monthEntriesCount = dbMonthCount;
            nextEntry = dbNext;
        } catch (dbError) {
            console.error("Diary DB Fallback failed.", dbError);
        }
    }

    const totalPages = Math.ceil(total / limit);
    const todayStr = now.toISOString().slice(0, 10);
    const todayEntry = entries.find(e => e.date.toISOString().slice(0, 10) === todayStr);

    const grouped: Record<string, typeof entries> = {};
    for (const entry of entries) {
        const d = new Date(entry.date);
        const entryMonth = months[d.getMonth()];
        const entryYear = d.getFullYear();
        const groupKey = `${entryMonth} ${entryYear}`;
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(entry);
    }

    // ── THEME COLOR CODING ───────────────────────────────────────────
    const getThemeStyles = (theme?: string | null) => {
        const t = theme?.toUpperCase() || "";
        if (t.includes("WORSHIP")) return "text-purple-500 bg-purple-500/10 border-purple-500/20";
        if (t.includes("COMFORT") || t.includes("TRUST")) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        if (t.includes("GRATITUDE") || t.includes("FAITH")) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (t.includes("PRAYER")) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        if (t.includes("STRENGTH")) return "text-rose-500 bg-rose-500/10 border-rose-500/20";
        return "text-muted-foreground bg-muted border-border";
    };

    // ── PAGINATION LOGIC (Rolling 4-page window) ──────────────────────────
    const getPaginationRange = () => {
        const range = [];
        const windowSize = 4;
        let start = page;
        if (start + windowSize - 1 > totalPages) {
            start = Math.max(1, totalPages - windowSize + 1);
        }
        for (let i = start; i < start + windowSize && i <= totalPages; i++) {
            range.push(i);
        }
        return range;
    };
    const paginationRange = getPaginationRange();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">The Church Diary</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <BookOpen size={12} className="text-[#6e1799]" />
                        <span>Daily digital scripture readings for the ministry congregation</span>
                    </div>
                </div>
                {canModify && (
                    <Link
                        href="/admin/diary/new"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#6e1799]/30 hover:-translate-y-1 transition-all"
                    >
                        <Plus size={16} />
                        <span>Add Daily Entry</span>
                    </Link>
                )}
            </div>


            {/* ── STATS CARDS ────────────────────────────────────────────── */}
            {isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#6e1799]/5 rounded-xl flex items-center justify-center text-[#6e1799]">
                            <Scroll size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Readings</p>
                            <p className="text-2xl font-black text-foreground">{totalEntries}</p>
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 border-l-4 border-l-blue-500">
                        <div className="w-12 h-12 bg-blue-500/5 rounded-xl flex items-center justify-center text-blue-500">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{months[now.getMonth()]} Coverage</p>
                            <p className="text-2xl font-black text-foreground">{monthEntriesCount} Days Active</p>
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
                        <div className="w-12 h-12 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-500">
                            <Star size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Upcoming Theme</p>
                            <p className="text-[13px] font-black text-foreground truncate w-40 max-w-xs">{nextEntry?.theme || "No upcoming theme"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FILTERS ────────────────────────────────────────────────── */}
            {isAdmin && <DiaryFilters months={months} />}

            {/* ── MEMBER VIEW ────────────────────────────────────────────── */}
            {!isAdmin ? (
                <div className="space-y-8">
                    {/* Month Tabs */}
                    <div className="bg-card p-2 rounded-2xl border border-border shadow-sm flex flex-wrap gap-1">
                        {months.map((m, i) => (
                            <Link
                                key={m}
                                href={`/admin/diary?month=${m}`}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === safeMonthIdx
                                    ? "bg-[#6e1799] text-white shadow-md"
                                    : "text-[#a5a3ae] hover:bg-[#6e1799]/5 hover:text-[#6e1799]"
                                }`}
                            >
                                {m}
                            </Link>
                        ))}
                    </div>

                    {/* Today's Special Card */}
                    {todayEntry && (
                        <div className="bg-card rounded-[2.5rem] p-8 border-2 border-[#6e1799]/10 shadow-xl shadow-[#6e1799]/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6e1799]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#6e1799] mb-4">
                                    <Star size={14} className="fill-[#6e1799]" />
                                    <span>Scripture of the Day</span>
                                </div>
                                <h3 className="text-[36px] font-black text-foreground tracking-tighter mb-2 leading-none uppercase">{todayEntry.title || "Spiritual Nourishment"}</h3>
                                {todayEntry.theme && (
                                    <p className="text-[15px] text-[#6e1799] font-medium italic mb-8 border-l-2 border-[#6e1799]/20 pl-4">{todayEntry.theme}</p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[todayEntry.readingOne, todayEntry.readingTwo, todayEntry.readingThree].filter(Boolean).map((r, i) => (
                                        <div key={i} className="bg-muted p-5 rounded-[1.5rem] border border-border group-hover:border-[#6e1799]/30 transition-colors">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Lesson {i+1}</p>
                                            <p className="text-[15px] font-black text-foreground">{r}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Monthly Readings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {entries.map((entry) => {
                            const entryDate = new Date(entry.date);
                            const isToday = entry.date.toISOString().slice(0, 10) === todayStr;
                            return (
                                <div key={entry.id} className={`bg-card rounded-[2rem] p-7 border transition-all ${isToday ? 'border-[#6e1799] shadow-lg shadow-[#6e1799]/5 scale-[1.02]' : 'border-border shadow-sm hover:border-[#6e1799]'}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{entryDate.toLocaleDateString('en-GB', { weekday: 'long' })}</p>
                                            <p className="text-[20px] font-black text-foreground tracking-tighter leading-none">{entryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
                                        </div>
                                        {isToday && (
                                            <span className="bg-[#6e1799] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Today</span>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {[entry.readingOne, entry.readingTwo, entry.readingThree].filter(Boolean).map((r, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-7 h-7 bg-muted rounded-lg border border-border flex items-center justify-center text-[#6e1799] opacity-70">
                                                    <Scroll size={14} />
                                                </div>
                                                <span className="text-[13px] font-bold text-foreground">{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {entries.length === 0 && (
                            <div className="col-span-2 py-20 bg-muted rounded-[2.5rem] border border-dashed border-border flex flex-col items-center justify-center gap-4">
                                <Clock size={48} className="text-muted-foreground/30" />
                                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">No readings scheduled for this cycle</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* ── ADMIN VIEW ─────────────────────────────────────────────── */
                <div className="space-y-8 pb-20">
                    {Object.entries(grouped).map(([month, monthEntries]) => (
                        <div key={month} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="bg-muted px-8 py-4 border-b border-border flex items-center justify-between">
                                <h3 className="text-[13px] font-black text-[#6e1799] uppercase tracking-widest">{month} Schedule</h3>
                                <ShieldCheck size={16} className="text-[#6e1799]/30" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-card border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            <th className="px-8 py-5 w-40">Entry Date</th>
                                            <th className="px-8 py-5">Title & Theme</th>
                                            <th className="px-8 py-5">Daily Scriptures</th>
                                            <th className="px-8 py-5 text-right">Vault Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#dbdade]/20">
                                        {monthEntries.map((entry) => {
                                            const isToday = entry.date.toISOString().slice(0, 10) === todayStr;
                                            return (
                                                <tr key={entry.id} className={`transition-colors group ${isToday ? 'bg-[#6e1799]/[0.03]' : 'hover:bg-[#6e1799]/[0.01]'}`}>
                                                    <td className="px-8 py-5 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-[13px] font-black ${isToday ? 'text-[#6e1799]' : 'text-foreground'}`}>
                                                                {new Date(entry.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                            {isToday && (
                                                                <span className="flex h-2 w-2 rounded-full bg-[#6e1799] animate-pulse" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <p className="text-[14px] font-black text-foreground leading-none mb-2 group-hover:text-[#6e1799] transition-colors uppercase tracking-tighter">
                                                            {entry.title || "—"}
                                                        </p>
                                                        {entry.theme && (
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getThemeStyles(entry.theme)}`}>
                                                                {entry.theme}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-wrap gap-2">
                                                            {[entry.readingOne, entry.readingTwo, entry.readingThree].filter(Boolean).map((r, i) => (
                                                                <a 
                                                                    key={i}
                                                                    href={`https://www.biblegateway.com/passage/?search=${r}&version=KJV`}
                                                                    target="_blank"
                                                                    className="group/pill inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border hover:border-[#6e1799] hover:text-[#6e1799] transition-all"
                                                                >
                                                                    <span>{r}</span>
                                                                    <ExternalLink size={10} className="opacity-0 group-hover/pill:opacity-100 transition-opacity" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-5">
                                                            <Link href={`/admin/diary/${entry.id}/edit`} className="text-[11px] font-black text-muted-foreground hover:text-[#6e1799] uppercase tracking-widest flex items-center gap-2 transition-colors">
                                                                <Edit2 size={12} /> Edit
                                                            </Link>
                                                            <DiaryDeleteButton id={entry.id} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {totalPages > 1 && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border/30">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                Showing page {page} of {totalPages}
                            </p>
                            
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href={`/admin/diary?page=1${search ? `&search=${search}` : ""}${monthStr ? `&month=${monthStr}` : ""}${yearStr ? `&year=${yearStr}` : ""}${themeStr ? `&theme=${themeStr}` : ""}`}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-card ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <ChevronsLeft size={16} />
                                </Link>
                                <Link
                                    href={`/admin/diary?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ""}${monthStr ? `&month=${monthStr}` : ""}${yearStr ? `&year=${yearStr}` : ""}${themeStr ? `&theme=${themeStr}` : ""}`}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-card ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <ChevronLeft size={16} />
                                </Link>

                                {paginationRange.map((p) => (
                                    <Link
                                        key={`page-${p}`}
                                        href={`/admin/diary?page=${p}${search ? `&search=${search}` : ""}${monthStr ? `&month=${monthStr}` : ""}${yearStr ? `&year=${yearStr}` : ""}${themeStr ? `&theme=${themeStr}` : ""}`}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-[11px] font-black transition-all ${p === page 
                                            ? "bg-[#6e1799] text-white shadow-md shadow-[#6e1799]/30 scale-110" 
                                            : "bg-card text-muted-foreground border border-border hover:border-[#6e1799] hover:text-[#6e1799]"
                                        }`}
                                    >
                                        {p}
                                    </Link>
                                ))}

                                <Link
                                    href={`/admin/diary?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ""}${monthStr ? `&month=${monthStr}` : ""}${yearStr ? `&year=${yearStr}` : ""}${themeStr ? `&theme=${themeStr}` : ""}`}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-card ${page === totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <ChevronRight size={16} />
                                </Link>
                                <Link
                                    href={`/admin/diary?page=${totalPages}${search ? `&search=${search}` : ""}${monthStr ? `&month=${monthStr}` : ""}${yearStr ? `&year=${yearStr}` : ""}${themeStr ? `&theme=${themeStr}` : ""}`}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-card ${page === totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <ChevronsRight size={16} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
