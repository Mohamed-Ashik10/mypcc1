import prisma from "@/lib/prisma";
import Link from "next/link";
import DiaryDeleteButton from "@/components/DiaryDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DiaryManagementPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; month?: string }>;
}) {
    const { page: pageStr, month: monthStr } = await searchParams;
    const page = parseInt(pageStr ?? "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);
    const isAdmin = canModify;

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // For member view: show entries for the selected month (default: current month)
    const now = new Date();
    const selectedMonthIdx = monthStr ? months.indexOf(monthStr) : now.getMonth();
    const safeMonthIdx = selectedMonthIdx === -1 ? now.getMonth() : selectedMonthIdx;

    // Admin: paginated all entries. Member: entries for selected month only.
    const [entries, total] = isAdmin
        ? await Promise.all([
            prisma.diaryEntry.findMany({ skip, take: limit, orderBy: { date: "asc" } }),
            prisma.diaryEntry.count(),
        ])
        : await Promise.all([
            prisma.diaryEntry.findMany({
                where: {
                    date: {
                        gte: new Date(now.getFullYear(), safeMonthIdx, 1),
                        lt: new Date(now.getFullYear(), safeMonthIdx + 1, 1),
                    },
                },
                orderBy: { date: "asc" },
            }),
            prisma.diaryEntry.count({
                where: {
                    date: {
                        gte: new Date(now.getFullYear(), safeMonthIdx, 1),
                        lt: new Date(now.getFullYear(), safeMonthIdx + 1, 1),
                    },
                },
            }),
        ]);

    const totalPages = Math.ceil(total / limit);

    // Today's entry (for member hero card)
    const todayStr = now.toISOString().slice(0, 10);
    const todayEntry = entries.find(e => e.date.toISOString().slice(0, 10) === todayStr);

    // Group by month for admin view
    const grouped: Record<string, typeof entries> = {};
    for (const entry of entries) {
        const month = months[new Date(entry.date).getMonth()];
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(entry);
    }

    // ── MEMBER VIEW ──────────────────────────────────────────────────────────
    if (!isAdmin) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">📖 Church Diary</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Daily scripture readings for your spiritual journey</p>
                    </div>
                </div>

                {/* Month Selector */}
                <div className="flex flex-wrap gap-2">
                    {months.map((m, i) => (
                        <Link
                            key={m}
                            href={`/admin/diary?month=${m}`}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${i === safeMonthIdx
                                ? "bg-blue-600 text-white border-blue-600 shadow"
                                : "bg-card text-muted-foreground border-border hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                        >
                            {m}
                        </Link>
                    ))}
                </div>

                {/* Today's Hero Card */}
                {todayEntry && (
                    <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Today's Reading</p>
                        <p className="text-2xl font-bold mb-1">{todayEntry.title ?? "Daily Scripture"}</p>
                        {todayEntry.theme && (
                            <p className="text-sm text-blue-200 italic mb-4">Theme: {todayEntry.theme}</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                            {[todayEntry.readingOne, todayEntry.readingTwo, todayEntry.readingThree]
                                .filter(Boolean)
                                .map((r, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-medium border border-white/20">
                                        📜 {r}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Entries Grid */}
                {entries.length === 0 ? (
                    <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                        <p className="text-5xl mb-4 text-muted-foreground/20">📖</p>
                        <p className="text-muted-foreground text-lg">No readings scheduled for {months[safeMonthIdx]}.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {entries.map((entry) => {
                            const entryDate = new Date(entry.date);
                            const dayStr = entryDate.toISOString().slice(0, 10);
                            const isToday = dayStr === todayStr;
                            return (
                                <div
                                    key={entry.id}
                                    className={`bg-card text-card-foreground rounded-2xl border p-5 transition-all hover:shadow-md ${isToday
                                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                                        : "border-border"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                {entryDate.toLocaleDateString("en-GB", { weekday: "long" })}
                                            </p>
                                            <p className="text-lg font-bold text-foreground">
                                                {entryDate.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                                            </p>
                                        </div>
                                        {isToday && (
                                            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">Today</span>
                                        )}
                                    </div>
                                    {entry.title && <p className="text-sm font-semibold text-foreground mb-1">{entry.title}</p>}
                                    {entry.theme && <p className="text-xs text-blue-600 dark:text-blue-400 italic mb-3">{entry.theme}</p>}
                                    <div className="space-y-1.5">
                                        {[entry.readingOne, entry.readingTwo, entry.readingThree]
                                            .filter(Boolean)
                                            .map((r, i) => (
                                                <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span className="text-muted-foreground/40">📜</span> {r}
                                                </p>
                                            ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // ── ADMIN VIEW ───────────────────────────────────────────────────────────
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">📖 Church Diary</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{total} entries total across the year</p>
                </div>
                <Link
                    href="/admin/diary/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
                >
                    ➕ Add Entry
                </Link>
            </div>

            {Object.keys(grouped).length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">📖</p>
                    <p className="text-muted-foreground text-lg">No diary entries yet.</p>
                    <Link href="/admin/diary/new" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Add the first entry →
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(grouped).map(([month, monthEntries]) => (
                        <div key={month} className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden border border-border">
                            <div className="bg-muted px-6 py-3 border-b border-border">
                                <h3 className="text-base font-semibold text-foreground">{month}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[800px]">
                                    <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Date</th>
                                            <th className="px-6 py-3 text-left">Title / Theme</th>
                                            <th className="px-6 py-3 text-left">Reading 1</th>
                                            <th className="px-6 py-3 text-left">Reading 2</th>
                                            <th className="px-6 py-3 text-left">Reading 3</th>
                                            {isAdmin && <th className="px-6 py-3 text-right">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {monthEntries.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                                                    {new Date(entry.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {entry.title ?? <span className="text-muted-foreground/40 italic">—</span>}
                                                    {entry.theme && (
                                                        <span className="ml-2 inline-block text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded">{entry.theme}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{entry.readingOne}</td>
                                                <td className="px-6 py-4 text-muted-foreground/60">{entry.readingTwo ?? "—"}</td>
                                                <td className="px-6 py-4 text-muted-foreground/60">{entry.readingThree ?? "—"}</td>
                                                {isAdmin && (
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link href={`/admin/diary/${entry.id}/edit`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">Edit</Link>
                                                            <DiaryDeleteButton id={entry.id} />
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={`/admin/diary?page=${p}`}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${p === page ? "bg-blue-600 text-white shadow-md scale-105" : "bg-card text-muted-foreground border border-border hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
