import { fetchFromBackend } from "@/lib/api";
import Link from "next/link";
import HymnDeleteButton from "@/components/HymnDeleteButton";
import HymnFilters from "@/components/HymnFilters";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Music, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HymnsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; tag?: string }>;
}) {
    const { page: pageStr, search: searchStr, tag: tagStr } = await searchParams;
    const page = parseInt(pageStr ?? "1");
    const limit = 30;
    const search = searchStr ?? "";
    const selectedTag = tagStr ?? "";

    // RUN IN PARALLEL: Session and Content Fetch
    const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search,
        tag: selectedTag
    }).toString();

    const [session, dataResponse] = await Promise.all([
        getServerSession(authOptions),
        fetchFromBackend<{ 
            hymns: any[], 
            total: number, 
            uniqueTags: string[] 
        }>(`/api/admin/content/hymns?${query}`).catch(err => {
            console.error("Failed to fetch hymns from backend:", err);
            return { hymns: [], total: 0, uniqueTags: [] };
        })
    ]);

    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);

    const hymns = dataResponse.hymns;
    const total = dataResponse.total;
    const uniqueTags = dataResponse.uniqueTags.sort();

    const totalPages = Math.ceil(total / limit);

    // ── PAGINATION LOGIC (Rolling 4-page window) ──────────────────────────
    const getPaginationRange = () => {
        const range = [];
        const windowSize = 4;
        
        // Rolling window: show [page, page + 3] but cap it
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
                    <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Hymnal Library</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <Music size={12} className="text-[#6e1799]" />
                        <span>{total} scores registered in the digital vault</span>
                    </div>
                </div>
                {canModify && (
                    <Link
                        href="/admin/hymns/new"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#6e1799]/30 hover:-translate-y-1 transition-all"
                    >
                        <Plus size={16} />
                        <span>Add New Hymn</span>
                    </Link>
                )}
            </div>

            {/* ── FILTERS ────────────────────────────────────────────────── */}
            <HymnFilters uniqueTags={uniqueTags} />

            {/* ── DATA TABLE ─────────────────────────────────────────────── */}
            {hymns.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#dbdade]/50 shadow-sm p-24 text-center">
                    <div className="w-20 h-20 bg-[#f8f7fa] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Music size={32} className="text-[#dbdade]" />
                    </div>
                    <p className="text-[#a5a3ae] text-sm font-bold uppercase tracking-widest">No matching hymnal records found</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-[#dbdade]/50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8f7fa] border-b border-[#dbdade]/50 text-[11px] font-black text-[#a5a3ae] uppercase tracking-widest">
                                    <th className="px-8 py-5 w-24">Number</th>
                                    <th className="px-8 py-5">Hymnal Title</th>
                                    <th className="px-8 py-5">First Line Excerpt</th>
                                    {canModify && <th className="px-8 py-5 text-right">Management</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dbdade]/30">
                                {hymns.map((hymn) => {
                                    const firstLine = hymn.lyrics.split(/\r?\n/).find((l: string) => l.trim().length > 0)?.trim() || hymn.title;
                                    return (
                                        <tr key={hymn.id} className="hover:bg-[#6e1799]/[0.02] transition-colors group">
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6e1799]/5 text-[#6e1799] font-black text-[13px] border border-[#6e1799]/10">
                                                    {hymn.number}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-[14px] font-black text-[#5d596c] group-hover:text-[#6e1799] transition-colors">{hymn.title}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-[12px] text-[#a5a3ae] italic line-clamp-1 max-w-sm">"{firstLine.substring(0, 70)}..."</p>
                                            </td>
                                            {canModify && (
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-5">
                                                        <Link 
                                                            href={`/admin/hymns/${hymn.id}/edit`} 
                                                            className="text-[11px] font-black text-[#a5a3ae] hover:text-[#6e1799] uppercase tracking-widest"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <HymnDeleteButton id={hymn.id} />
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── PAGINATION ─────────────────────────────────────────────── */}
            {totalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-[#dbdade]/30">
                    <p className="text-[10px] font-black text-[#a5a3ae] uppercase tracking-widest">
                        Showing page {page} of {totalPages} ({total} Total Results)
                    </p>
                    
                    <div className="flex items-center gap-1.5">
                        {/* First & Prev */}
                        <div className="flex items-center gap-1.5 mr-2">
                            <Link
                                href={`/admin/hymns?page=1${search ? `&search=${search}` : ""}${selectedTag ? `&tag=${selectedTag}` : ""}`}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border border-[#dbdade]/50 text-[#a5a3ae] hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-white ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                                title="First Page"
                            >
                                <ChevronsLeft size={16} />
                            </Link>
                            <Link
                                href={`/admin/hymns?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ""}${selectedTag ? `&tag=${selectedTag}` : ""}`}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border border-[#dbdade]/50 text-[#a5a3ae] hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-white ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                                title="Previous Page"
                            >
                                <ChevronLeft size={16} />
                            </Link>
                        </div>

                        {/* Page Numbers (Rolling Window) */}
                        {paginationRange.map((p) => (
                            <Link
                                key={`page-${p}`}
                                href={`/admin/hymns?page=${p}${search ? `&search=${search}` : ""}${selectedTag ? `&tag=${selectedTag}` : ""}`}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-[11px] font-black transition-all ${p === page 
                                    ? "bg-[#6e1799] text-white shadow-md shadow-[#6e1799]/30 scale-110" 
                                    : "bg-white text-[#a5a3ae] border border-[#dbdade]/50 hover:border-[#6e1799] hover:text-[#6e1799]"
                                }`}
                            >
                                {p}
                            </Link>
                        ))}

                        {/* Next & Last */}
                        <div className="flex items-center gap-1.5 ml-2">
                            <Link
                                href={`/admin/hymns?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ""}${selectedTag ? `&tag=${selectedTag}` : ""}`}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border border-[#dbdade]/50 text-[#a5a3ae] hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-white ${page === totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                                title="Next Page"
                            >
                                <ChevronRight size={16} />
                            </Link>
                            <Link
                                href={`/admin/hymns?page=${totalPages}${search ? `&search=${search}` : ""}${selectedTag ? `&tag=${selectedTag}` : ""}`}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border border-[#dbdade]/50 text-[#a5a3ae] hover:border-[#6e1799] hover:text-[#6e1799] transition-all bg-white ${page === totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                                title="Last Page"
                            >
                                <ChevronsRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
