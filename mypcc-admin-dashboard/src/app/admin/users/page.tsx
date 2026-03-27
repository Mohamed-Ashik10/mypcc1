import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserManagementClient from "@/components/UserManagementClient";
import { ShieldAlert, Users } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UserManagementPage() {
    // RUN IN PARALLEL: Initial security check and data fetch
    let session = null;
    let usersResponse: any[] = [];
    
    try {
        [session, usersResponse] = await Promise.all([
            getServerSession(authOptions),
            fetchFromBackend<any[]>("/api/admin/users")
        ]);
    } catch (err) {
        console.error("Failed to fetch users from backend. Using Prisma Fallback.", err);
        session = await getServerSession(authOptions).catch(() => null);
        try {
            usersResponse = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' }
            });
        } catch (dbError) {
            console.error("Users DB Fallback failed.", dbError);
        }
    }

    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
        redirect("/admin");
    }

    const users = usersResponse;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[26px] font-black text-primary tracking-tighter uppercase leading-none mb-2">Account Control Center</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <Users size={12} className="text-primary" />
                        <span>Governing {users.length} registered accounts across the ministry</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl">
                    <ShieldAlert size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">High Security Access</span>
                </div>
            </div>

            <UserManagementClient initialUsers={users} />
        </div>
    );
}
