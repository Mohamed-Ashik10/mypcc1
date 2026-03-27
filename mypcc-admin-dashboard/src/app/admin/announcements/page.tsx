import { fetchFromBackend } from "@/lib/api";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AnnouncementDeleteButton from "@/components/AnnouncementDeleteButton";
import { Megaphone, Plus, Clock, ShieldCheck, ShieldAlert, Edit2 } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);

    let announcements: any[] = [];
    try {
        const query = canModify ? "" : "?activeOnly=true";
        announcements = await fetchFromBackend<any[]>(`/api/admin/announcements${query}`);
    } catch (error) {
        console.error("Failed to fetch announcements from backend. Using Prisma Fallback.", error);
        try {
            const where: any = {};
            if (!canModify) {
                where.isActive = true;
            }
            announcements = await prisma.announcement.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
        } catch (dbError) {
            console.error("Announcements DB Fallback failed.", dbError);
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Direct Ministry Broadcasts</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <Megaphone size={12} className="text-[#6e1799]" />
                        <span>Sending digital word to {announcements.filter(a => a.isActive).length} active connections</span>
                    </div>
                </div>
                {canModify && (
                    <Link
                        href="/admin/announcements/new"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#6e1799]/30 hover:-translate-y-1 transition-all"
                    >
                        <Plus size={16} />
                        <span>Post New Broadcast</span>
                    </Link>
                )}
            </div>

            {/* ── CONTENT ────────────────────────────────────────────────── */}
            {announcements.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#dbdade]/50 shadow-sm p-24 text-center">
                    <div className="w-20 h-20 bg-[#f8f7fa] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Megaphone size={32} className="text-[#dbdade]" />
                    </div>
                    <p className="text-[#a5a3ae] text-sm font-bold uppercase tracking-widest">No active broadcasts in the digital ministry</p>
                </div>
            ) : (
                <div className="space-y-6 pb-20">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-white rounded-[2rem] border border-[#dbdade]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                             {/* Side Accent */}
                             <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${announcement.isActive ? 'bg-[#6e1799]' : 'bg-slate-300'}`} />
                             
                             <div className="p-8 flex flex-col md:flex-row gap-8 items-start relative z-10">
                                {/* Icon Block */}
                                <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center ${announcement.isActive ? 'bg-[#6e1799]/5 text-[#6e1799]' : 'bg-slate-50 text-slate-300'} border border-current opacity-60`}>
                                    <Megaphone size={24} />
                                </div>

                                {/* Body */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-[20px] font-black text-[#5d596c] tracking-tight group-hover:text-[#6e1799] transition-colors uppercase leading-none">{announcement.title}</h3>
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${announcement.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            {announcement.isActive ? "Live Feed" : "Archived Feed"}
                                        </span>
                                    </div>
                                    
                                    <p className="text-[#a5a3ae] text-[14px] leading-relaxed font-medium whitespace-pre-line line-clamp-2 max-w-4xl">
                                        {announcement.content}
                                    </p>

                                    <div className="pt-4 flex items-center gap-6 text-[10px] font-black text-[#a5a3ae] uppercase tracking-widest border-t border-[#dbdade]/30">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-[#6e1799]" />
                                            <span>Broadcasted {new Date(announcement.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {announcement.isActive ? <ShieldCheck size={12} className="text-emerald-500" /> : <ShieldAlert size={12} className="text-slate-300" />}
                                            <span>{announcement.isActive ? "Visible to Members" : "Admin Only"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Management */}
                                {canModify && (
                                    <div className="w-full md:w-auto flex items-center md:flex-col justify-end md:justify-center gap-5 md:pl-8 md:border-l border-[#dbdade]/40 self-stretch">
                                        <Link
                                            href={`/admin/announcements/${announcement.id}/edit`}
                                            className="text-[11px] font-black text-[#6e1799] uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <Edit2 size={12} />
                                            <span>Modify</span>
                                        </Link>
                                        <AnnouncementDeleteButton id={announcement.id} />
                                    </div>
                                )}
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
