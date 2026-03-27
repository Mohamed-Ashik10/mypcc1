import { fetchFromBackend } from "@/lib/api";
import Link from "next/link";
import TestimonialDeleteButton from "@/components/TestimonialDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MessageSquareQuote, Plus, ShieldCheck, ShieldAlert, Edit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "NORMAL_USER";
  
  if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
    redirect("/admin");
  }

  let testimonials: any[] = [];
  try {
    testimonials = await fetchFromBackend<any[]>("/api/admin/testimonials");
  } catch (error) {
    console.error("Failed to fetch testimonials from backend:", error);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Voices of Faith</h2>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                    <MessageSquareQuote size={12} className="text-[#6e1799]" />
                    <span>Curating {testimonials.length} community testimonials for the public portal</span>
                </div>
            </div>
            <Link
                href="/admin/testimonials/new"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6e1799] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#6e1799]/30 hover:-translate-y-1 transition-all"
            >
                <Plus size={16} />
                <span>Add New Testimony</span>
            </Link>
        </div>

        {/* ── DATA TABLE ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#dbdade]/50 shadow-sm overflow-hidden">
            {testimonials.length === 0 ? (
                <div className="p-24 text-center">
                    <div className="w-16 h-16 bg-[#f8f7fa] rounded-full flex items-center justify-center mx-auto mb-4 text-[#dbdade]">
                        <MessageSquareQuote size={32} />
                    </div>
                    <p className="text-[#a5a3ae] text-[11px] font-black uppercase tracking-widest">No testimonies found in the library</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8f7fa] border-b border-[#dbdade]/50 text-[11px] font-black text-[#a5a3ae] uppercase tracking-widest">
                                <th className="px-8 py-5">Witness Author</th>
                                <th className="px-8 py-5">Spiritual Role</th>
                                <th className="px-8 py-5">Testimony Excerpt</th>
                                <th className="px-8 py-5 text-center">Visibility</th>
                                <th className="px-8 py-5 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dbdade]/30">
                            {testimonials.map((t) => (
                                <tr key={t.id} className="hover:bg-[#6e1799]/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-[#6e1799]/5 border border-[#6e1799]/10 flex items-center justify-center text-[#6e1799] font-black text-xs uppercase">
                                                {t.authorName[0]}
                                            </div>
                                            <span className="text-[14px] font-black text-[#5d596c] leading-none">{t.authorName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                                        {t.authorRole || "Anonymous Member"}
                                    </td>
                                    <td className="px-8 py-5 text-[13px] text-[#a5a3ae] max-w-xs truncate italic">
                                        "{t.content}"
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${t.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                            {t.isActive ? "Published" : "Embargoed"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-5">
                                            <Link
                                                href={`/admin/testimonials/${t.id}/edit`}
                                                className="text-[11px] font-black text-[#a5a3ae] hover:text-[#6e1799] uppercase tracking-widest flex items-center gap-2 transition-colors"
                                            >
                                                <Edit2 size={12} />
                                                Edit
                                            </Link>
                                            <TestimonialDeleteButton id={t.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
  );
}
