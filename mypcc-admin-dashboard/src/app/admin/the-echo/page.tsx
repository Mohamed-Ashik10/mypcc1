import { fetchFromBackend } from "@/lib/api";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EchoDeleteButton from "@/components/EchoDeleteButton";
import EchoFilters from "@/components/EchoFilters";
import { Newspaper, Upload, Search, Calendar, ShieldCheck, Lock, Star, Eye, Edit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TheEchoPage({ searchParams }: { searchParams: Promise<{ search?: string, year?: string, month?: string }> }) {
    const { search, year, month } = await searchParams;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);
    const isMember = !canModify;

    let issues: any[] = [];
    try {
        const query = new URLSearchParams({
            search: search ?? "",
            year: year ?? "",
            month: month ?? ""
        }).toString();
        
        const data = await fetchFromBackend<{ list: any[], total: number }>(`/api/admin/content/echo?${query}`);
        issues = data.list ?? [];
    } catch (error) {
        console.error("Failed to fetch echo issues from backend:", error);
    }

    const hasAccess = true; // Placeholder for subscription check

    const latestFree = issues.find(i => i.isFree);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">The Echo Newsletter</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Newspaper size={12} className="text-[#6e1799]" />
                        <span>{issues.length} spiritual publications in the digital archive</span>
                    </div>
                </div>
                {canModify && (
                    <Link
                        href="/admin/the-echo/new"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#6e1799]/30 hover:-translate-y-1 transition-all"
                    >
                        <Upload size={16} />
                        <span>Upload New Issue</span>
                    </Link>
                )}
            </div>

            {/* ── FILTERS ────────────────────────────────────────────────── */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-hidden">
                <EchoFilters initialYear={year} />
            </div>

            {/* ── LATEST HIGHLIGHT (Member View) ────────────────────────── */}
            {isMember && !search && !year && latestFree && (
                <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6e1799]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                    <div className="w-full md:w-48 h-64 flex-shrink-0 bg-muted rounded-3xl overflow-hidden border border-border shadow-lg group relative">
                        {latestFree.coverUrl ? (
                            <img src={latestFree.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={latestFree.title} />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                <Newspaper size={40} className="text-muted-foreground/30" />
                                <span className="text-[10px] font-black text-[#6e1799]/40 uppercase tracking-widest">No Cover</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Free Issue</div>
                    </div>
                    <div className="flex-1 relative z-10 text-center md:text-left">
                        <p className="text-[11px] font-black text-[#6e1799] uppercase tracking-[0.3em] mb-3">Latest Publication</p>
                        <h3 className="text-[32px] font-black text-foreground tracking-tighter leading-none mb-4">{latestFree.title}</h3>
                        <p className="text-[14px] text-muted-foreground font-medium italic mb-8 max-w-xl">
                            {latestFree.excerpt || `Experience the latest spiritual insights and community news from the Presbyterian Church in Cameroon for ${new Date(latestFree.issueMonth).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}.`}
                        </p>
                        <Link
                            href={`/admin/the-echo/${latestFree.id}`}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#6e1799]/30 hover:-translate-y-1 transition-all"
                        >
                            <Eye size={16} />
                            <span>Read Full Digital Issue</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* ── GRID CONTENT ───────────────────────────────────────────── */}
            {issues.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border shadow-sm p-24 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Newspaper size={32} className="text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">No newsletter issues found in the archive</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {issues.map((issue) => {
                        const canView = issue.isFree || hasAccess;
                        const dateStr = new Date(issue.issueMonth).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

                        return (
                            <div key={issue.id} className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                                {/* Cover Area */}
                                <div className="h-44 bg-muted relative overflow-hidden">
                                     {issue.coverUrl ? (
                                        <img src={issue.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={issue.title} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-card">
                                            <Newspaper size={48} className="text-muted-foreground/20 group-hover:scale-110 group-hover:text-[#6e1799]/20 transition-all" />
                                            <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">No Issue Cover</span>
                                        </div>
                                    )}
                                    
                                    {/* Lock Overlay for members */}
                                    {isMember && !canView && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-6">
                                            <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center text-[#6e1799] mb-4 shadow-2xl border border-border/50">
                                                <Lock size={24} className="animate-pulse" />
                                            </div>
                                            <p className="text-white text-[11px] font-black uppercase tracking-widest text-center">Premium Patron Issue</p>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${issue.isFree 
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                            : "bg-[#6e1799]/10 text-[#6e1799] border-[#6e1799]/20"}`}>
                                            {issue.isFree ? "General Access" : "Patron Only"}
                                        </span>
                                        {issue.isFeatured && (
                                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                                <Star size={10} /> Special Edition
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Details Area */}
                                <div className="p-7">
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Calendar size={12} className="text-[#6e1799]" />
                                        {dateStr}
                                    </p>
                                    <h4 className="text-[19px] font-black text-foreground leading-tight mb-6 line-clamp-1 group-hover:text-[#6e1799] transition-colors uppercase tracking-tighter">{issue.title}</h4>
                                    
                                    <div className="pt-5 border-t border-border flex items-center justify-between">
                                        {canView ? (
                                            <Link href={`/admin/the-echo/${issue.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#6e1799]/5 text-[#6e1799] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#6e1799] hover:text-white transition-all shadow-sm">
                                                <Eye size={12} /> View Issue
                                            </Link>
                                        ) : (
                                            <Link href="/admin/subscriptions" className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
                                                <Lock size={12} /> Unlock Archive
                                            </Link>
                                        )}

                                        {canModify && (
                                            <div className="flex items-center gap-3">
                                                <Link href={`/admin/the-echo/${issue.id}/edit`} className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-[#6e1799]/10 hover:text-[#6e1799] transition-all" title="Edit Issue">
                                                    <Edit2 size={14} />
                                                </Link>
                                                <EchoDeleteButton id={issue.id} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
