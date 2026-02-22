import prisma from "@/lib/prisma";
import Link from "next/link";
import DiaryDeleteButton from "@/components/DiaryDeleteButton";

export const dynamic = "force-dynamic";

export default async function DiaryManagementPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageStr } = await searchParams;
    const page = parseInt(pageStr ?? "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
        prisma.diaryEntry.findMany({
            skip,
            take: limit,
            orderBy: { date: "asc" },
        }),
        prisma.diaryEntry.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Group entries by month
    const grouped: Record<string, typeof entries> = {};
    for (const entry of entries) {
        const month = months[new Date(entry.date).getMonth()];
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(entry);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">📖 Church Diary</h2>
                    <p className="text-muted-foreground mt-1">{total} entries total across the year</p>
                </div>
                <Link
                    href="/admin/diary/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95"
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
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Title / Theme</th>
                                        <th className="px-6 py-3 text-left">Reading 1</th>
                                        <th className="px-6 py-3 text-left">Reading 2</th>
                                        <th className="px-6 py-3 text-left">Reading 3</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
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
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/diary/${entry.id}/edit`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">Edit</Link>
                                                    <DiaryDeleteButton id={entry.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
