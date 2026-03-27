import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Landmark, ShieldCheck } from "lucide-react";
import PccInfoManagement from "@/components/PccInfoManagement";

export const dynamic = "force-dynamic";

export default async function PccInfoPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    
    if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
        redirect("/admin");
    }

    let sections: any[] = [];
    try {
        sections = await fetchFromBackend<any[]>("/api/admin/pcc-info");
    } catch (error) {
        console.error("Failed to fetch PCC Info from backend:", error);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-[1600px] mx-auto">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h2 className="text-[32px] font-black text-primary tracking-tighter uppercase leading-none">Church Governance</h2>
                    <div className="flex items-center gap-3 text-[11px] font-black text-[#a5a3ae] uppercase tracking-[0.2em]">
                        <Landmark size={14} className="text-primary" strokeWidth={3} />
                        <span>Governing {sections.length} Certified Segments • Official PCC Ledger</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 px-6 py-3 bg-primary/5 text-primary border border-primary/10 rounded-2xl shadow-sm">
                    <ShieldCheck size={20} className="opacity-80" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] leading-none">Institutional Authority</span>
                </div>
            </div>

            <PccInfoManagement initialSections={JSON.parse(JSON.stringify(sections))} />
        </div>
    );
}
