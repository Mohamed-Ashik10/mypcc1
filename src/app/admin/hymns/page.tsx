import prisma from "@/lib/prisma";
import Link from "next/link";
import HymnDeleteButton from "@/components/HymnDeleteButton";

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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">🎵 Hymns</h2>
                    <p className="text-gray-500 mt-1">{total} hymns in the database</p>
                </div>
                <Link
                    href="/admin/hymns/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition"
                >
                    ➕ Add Hymn
                </Link>
            </div>

            <form method="GET" className="mb-6">
                <div className="flex gap-3 max-w-md">
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Search by number or title…"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition">
                        Search
                    </button>
                </div>
            </form>

            {hymns.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <p className="text-5xl mb-4">🎵</p>
                    <p className="text-gray-500 text-lg">No hymns found.</p>
                    <Link href="/admin/hymns/new" className="mt-4 inline-block text-blue-600 hover:underline font-medium">
                        Add the first hymn →
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3 text-left w-20">No.</th>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-6 py-3 text-left">First Line</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {hymns.map((hymn) => (
                                <tr key={hymn.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-blue-700">{hymn.number}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{hymn.title}</td>
                                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{hymn.lyrics.split("\n")[0]}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/hymns/${hymn.id}/edit`} className="text-xs font-medium text-blue-600 hover:text-blue-800 transition">Edit</Link>
                                            <HymnDeleteButton id={hymn.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={`/admin/hymns?page=${p}${search ? `&search=${search}` : ""}`}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${p === page ? "bg-blue-600 text-white shadow" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400"
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
