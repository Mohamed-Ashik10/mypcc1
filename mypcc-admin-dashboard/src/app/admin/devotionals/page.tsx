import { fetchFromBackend } from "@/lib/api";
import Link from "next/link";
import DevotionalDeleteButton from "@/components/DevotionalDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Bird, Plus, Calendar, User as UserIcon, Lock, Clock, BookOpen, Quote, Edit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DevotionalsPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);

    let devotionals: any[] = [];
    try {
        const data = await fetchFromBackend<{ devotionals: any[] }>("/api/admin/content/devotionals?page=1&limit=50");
        devotionals = data.devotionals;
    } catch (error) {
        console.error("Failed to fetch devotionals from backend:", error);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Daily Manna Devotionals</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Bird size={12} className="text-[#6e1799]" />
                        <span>Governing {devotionals.length} spiritual meditations in the digital archive</span>
                    </div>
                </div>
                {canModify && (
                    <Link
                        href="/admin/devotionals/new"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#6e1799]/30 hover:-translate-y-1 transition-all"
                    >
                        <Plus size={16} />
                        <span>Produce New Manna</span>
                    </Link>
                )}
            </div>

            {/* ── LIST ───────────────────────────────────────────────────── */}
            {devotionals.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border shadow-sm p-24 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bird size={32} className="text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">No devotional entries found in the archive</p>
                </div>
            ) : (
                <div className="space-y-6 pb-12">
                    {devotionals.map((d) => {
                        const dateObj = new Date(d.date);
                        const isQueued = dateObj > new Date();
                        
                        return (
                            <div key={d.id} className="bg-card rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                                {/* Decor Block */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6e1799]/5 rounded-full -mr-16 -mt-16 blur-xl pointer-events-none" />
                                
                                <div className="p-8 flex flex-col md:flex-row gap-8 items-start relative z-10">
                                    {/* Date Circle */}
                                    <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-3xl border border-border flex flex-col items-center justify-center text-[#6e1799] group-hover:scale-105 transition-transform duration-500 shadow-sm">
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">
                                            {dateObj.toLocaleDateString('en-GB', { month: 'short' })}
                                        </p>
                                        <p className="text-[28px] font-black leading-none mb-1">{dateObj.getDate()}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground leading-none uppercase tracking-tighter">
                                            {dateObj.getFullYear()}
                                        </p>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-[19px] font-black text-foreground leading-tight group-hover:text-[#6e1799] transition-colors uppercase tracking-widest">{d.title}</h3>
                                            
                                            {/* Status Badges */}
                                            {isQueued && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 rounded-lg border border-amber-500/20 shadow-sm">
                                                    <Clock size={10} /> Queued Delivery
                                                </span>
                                            )}
                                            {!d.isFree && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-[#6e1799]/10 text-[#6e1799] rounded-lg border border-[#6e1799]/20 shadow-sm">
                                                    <Lock size={10} /> {d.minPlan === 'SHEPHERD' ? 'Shepherd' : 'Pilgrim'} 
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <UserIcon size={12} className="text-[#6e1799]" />
                                                <span>By {d.author || "PCC Editorial"}</span>
                                            </div>
                                            <div className="h-1 w-1 bg-border rounded-full" />
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen size={12} className="text-[#6e1799]" />
                                                <span>Verse of Day</span>
                                            </div>
                                        </div>

                                        <div className="relative pt-2">
                                            <Quote size={20} className="absolute -left-2 -top-1 text-[#6e1799]/10 rotate-180" />
                                            <p className="text-muted-foreground text-[14px] leading-relaxed font-medium italic line-clamp-2 pl-4 border-l-2 border-[#6e1799]/10">
                                                {d.excerpt || (typeof d.content === 'string' ? d.content.substring(0, 160) : "Journal entry recorded in vault...") + "..."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:justify-center gap-4 md:pl-8 md:border-l border-border/40 self-stretch">
                                        <Link href={`/admin/devotionals/${d.id}/edit`} className="text-[11px] font-black text-muted-foreground hover:text-[#6e1799] uppercase tracking-widest flex items-center gap-2 transition-transform">
                                            <Edit2 size={12} />
                                            <span>Edit Journal</span>
                                        </Link>
                                        {canModify && <DevotionalDeleteButton id={d.id} />}
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
