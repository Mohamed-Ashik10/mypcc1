import prisma from "@/lib/prisma";
import Link from "next/link";
import HymnDeleteButton from "@/components/HymnDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HymnsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const { page: pageStr, search: searchStr } = await searchParams;
    const page = parseInt(pageStr ?? "1");
    const limit = 30;
    const skip = (page - 1) * limit;
    const search = searchStr ?? "";

    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "MEMBER";
    const canModify = ["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR"].includes(userRole);

    const where = search
        ? {
            OR: [
                { title: { contains: search } },
                { number: { equals: parseInt(search) || undefined } },
            ],
        }
        : {};

    const [hymns, total] = await Promise.all([
        prisma.hymn.findMany({ where, skip, take: limit, orderBy: { number: "asc" } }),
        prisma.hymn.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">🎵 Hymns</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{total} hymns in the database</p>
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
                <div className="flex gap-3 max-w-md">
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Search by number or title…"
                        className="flex-1 rounded-lg border border-border bg-card text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-all active:scale-95">
                        Search
                    </button>
                </div>
            </form>

            {hymns.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">🎵</p>
                    <p className="text-muted-foreground text-lg">No hymns found.</p>
                    {canModify && (
                        <Link href="/admin/hymns/new" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Add the first hymn →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
                                <tr>
                                    <th className="px-6 py-3 text-left w-20">No.</th>
                                    <th className="px-6 py-3 text-left">Title</th>
                                    <th className="px-6 py-3 text-left">First Line</th>
                                    {canModify && <th className="px-6 py-3 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {hymns.map((hymn) => (
                                    <tr key={hymn.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{hymn.number}</td>
                                        <td className="px-6 py-4 font-medium text-foreground">{hymn.title}</td>
                                        <td className="px-6 py-4 text-muted-foreground/60 max-w-xs truncate">{hymn.lyrics.split("\n")[0]}</td>
                                        {canModify && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link href={`/admin/hymns/${hymn.id}/edit`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">Edit</Link>
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
                            href={`/admin/hymns?page=${p}${search ? `&search=${search}` : ""}`}
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
