import prisma from "@/lib/prisma";
import Link from "next/link";
import HymnDeleteButton from "@/components/HymnDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HymnsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; tag?: string }>;
}) {
    const { page: pageStr, search: searchStr, tag: tagStr } = await searchParams;
    const page = parseInt(pageStr ?? "1");
    const limit = 30;
    const skip = (page - 1) * limit;
    const search = searchStr ?? "";
    const selectedTag = tagStr ?? "";

    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);

    const where: any = {
        AND: [
            search
                ? {
                    OR: [
                        { title: { contains: search } },
                        { number: { equals: parseInt(search) || undefined } },
                    ],
                }
                : {},
            selectedTag
                ? { tags: { contains: selectedTag } }
                : {},
        ],
    };

    const [hymns, total, allHymnsWithTags] = await Promise.all([
        prisma.hymn.findMany({ where, skip, take: limit, orderBy: { number: "asc" } }),
        prisma.hymn.count({ where }),
        prisma.hymn.findMany({ select: { tags: true }, where: { NOT: { tags: null } } }),
    ]);

    const uniqueTags = Array.from(
        new Set(
            allHymnsWithTags
                .flatMap((h) => h.tags?.split(",").map((t) => t.trim()) ?? [])
                .filter((t) => t.length > 0)
        )
    ).sort();

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">🎵 Hymns</h2>
                    <p className="text-slate-500 dark:text-white/40 mt-1 text-sm">{total} hymns in the database</p>
                </div>
                {canModify && (
                    <Link
                        href="/admin/hymns/new"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
                    >
                        ➕ Add Hymn
                    </Link>
                )}
            </div>

            <form method="GET" className="mb-6">
                <div className="flex flex-wrap gap-3 max-w-2xl">
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Search by number or title…"
                        className="flex-1 min-w-[200px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6c47ff]"
                    />
                    <select
                        name="tag"
                        defaultValue={selectedTag}
                        className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6c47ff] min-w-[150px]"
                    >
                        <option value="">All Tags</option>
                        {uniqueTags.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <button type="submit" className="px-5 py-2.5 bg-slate-900 dark:bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-white/20 transition-all active:scale-95 border border-transparent dark:border-white/10">
                        Filter
                    </button>
                    {(search || selectedTag) && (
                        <Link href="/admin/hymns" className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 text-sm font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-transparent dark:border-white/10 flex items-center">
                            Reset
                        </Link>
                    )}
                </div>
            </form>

            {hymns.length === 0 ? (
                <div className="bg-white dark:bg-[#111127]/90 rounded-2xl shadow-md p-12 text-center border border-slate-200 dark:border-white/[0.08]">
                    <p className="text-5xl mb-4 text-slate-300 dark:text-white/20">🎵</p>
                    <p className="text-slate-500 dark:text-white/40 text-lg">No hymns found.</p>
                    {canModify && (
                        <Link href="/admin/hymns/new" className="mt-4 inline-block text-blue-600 dark:text-[#a855f7] hover:underline font-medium">
                            Add the first hymn →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#111127]/90 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-white/[0.08]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead className="bg-slate-50 dark:bg-white/5 text-xs text-slate-500 dark:text-white/40 uppercase tracking-wide">
                                <tr>
                                    <th className="px-6 py-4 text-left w-20 font-bold">No.</th>
                                    <th className="px-6 py-4 text-left font-bold">Title</th>
                                    <th className="px-6 py-4 text-left font-bold">First Line</th>
                                    {canModify && <th className="px-6 py-4 text-right font-bold">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {hymns.map((hymn) => (
                                    <tr key={hymn.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-bold text-blue-600 dark:text-[#a855f7]">{hymn.number}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{hymn.title}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-white/50 max-w-xs truncate">{hymn.lyrics.split("\n")[0]}</td>
                                        {canModify && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    <Link href={`/admin/hymns/${hymn.id}/edit`} className="text-xs font-semibold text-slate-400 dark:text-white/30 hover:text-blue-600 dark:hover:text-white transition">Edit</Link>
                                                    <HymnDeleteButton id={hymn.id} />
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={`/admin/hymns?page=${p}${search ? `&search=${search}` : ""}${selectedTag ? `&tag=${selectedTag}` : ""}`}
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
