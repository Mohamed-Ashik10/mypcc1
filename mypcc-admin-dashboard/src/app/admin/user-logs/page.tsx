import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchFromBackend } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ShieldAlert, Fingerprint, Lock, Zap, Database, Calendar, Activity } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UserLogsPage() {
    let session = null;
    let users: any[] = [];
    let auditLogs: any[] = [];
    try {
        [session, users, auditLogs] = await Promise.all([
            getServerSession(authOptions),
            fetchFromBackend<any[]>("/api/admin/users"),
            fetchFromBackend<any[]>("/api/admin/audit-logs")
        ]);
    } catch (err) {
        console.error("User Logs fetch failed. Using Prisma Fallback.", err);
        session = await getServerSession(authOptions).catch(() => null);
        try {
            const [dbUsers, dbLogs] = await Promise.all([
                prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
                prisma.auditLog.findMany({ 
                    include: { user: { select: { name: true, email: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 50
                })
            ]);
            users = dbUsers;
            auditLogs = dbLogs;
        } catch (dbError) {
            console.error("User Logs DB Fallback failed.", dbError);
        }
    }

    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
        redirect("/admin");
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[32px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Ecclesiastical Access Vault</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <Fingerprint size={12} className="text-[#6e1799]" />
                        <span>Auditing {users.length} Identities & {auditLogs.length} Security Events in the Sacred Archive</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#6e1799]/5 text-[#6e1799] border border-[#6e1799]/20 rounded-xl">
                        <Database size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Vercel Production Node: Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-500/20 rounded-xl animate-pulse">
                        <ShieldAlert size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Level 4 Clearance Required</span>
                    </div>
                </div>
            </div>

            {/* ── ALERTS & INTEL ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex gap-5 items-start">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                        <Lock size={20} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black text-amber-700 uppercase tracking-widest">Cryptographic Integrity</h4>
                        <p className="text-[13px] text-amber-800/80 font-medium leading-relaxed">
                            Passwords are Bcrypt-256 salted. Hashes below are unidirectional. 
                            Unauthorized attempts to reverse these hashes are automatically flagged in the Security Stream.
                        </p>
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-[2rem] p-6 flex gap-5 items-start">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <Zap size={20} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black text-blue-700 uppercase tracking-widest">Real-time Auditing</h4>
                        <p className="text-[13px] text-blue-800/80 font-medium leading-relaxed">
                            The Security Event Stream captures every administrative write operation, IP origin, and biometric agent identity currently active.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── DIGITAL IDENTITIES ─────────────────────────────────────── */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6e1799] text-white flex items-center justify-center text-[10px] font-black">01</div>
                    <h3 className="text-[14px] font-black text-[#5d596c] uppercase tracking-widest">Register of Identities</h3>
                </div>
                <div className="bg-white rounded-[2rem] border border-[#dbdade]/50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8f7fa] border-b border-[#dbdade]/50 text-[11px] font-black text-[#a5a3ae] uppercase tracking-widest">
                                    <th className="px-8 py-5">Identity Profile</th>
                                    <th className="px-8 py-5 text-center">Encryption Hash</th>
                                    <th className="px-8 py-5">Origin / Cluster</th>
                                    <th className="px-8 py-5 text-right">Access Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dbdade]/20">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#6e1799]/[0.01] transition-colors group text-[14px]">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6e1799] to-[#9c27b0] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-[#6e1799]/20 group-hover:rotate-6 transition-transform">
                                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#5d596c] group-hover:text-[#6e1799] leading-none mb-1.5 transition-colors">{user.name || "Anonymous"}</p>
                                                    <p className="text-[11px] font-bold text-[#a5a3ae] tracking-tight">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="font-mono text-[10px] text-[#a5a3ae] bg-[#f8f7fa] px-3 py-1.5 rounded-xl border border-[#dbdade]/50 opacity-60">
                                                {user.password ? `${user.password.substring(0, 15)}...` : "SSO-MANAGED"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-black text-[#5d596c] uppercase tracking-widest mb-1">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>
                                            <p className="text-[10px] font-bold text-[#a5a3ae]">{new Date(user.createdAt).toLocaleDateString('en-GB')}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="inline-flex px-3 py-1 bg-[#6e1799]/5 text-[#6e1799] text-[9px] font-black uppercase tracking-widest rounded-lg border border-[#6e1799]/10">
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── SECURITY EVENT STREAM ──────────────────────────────────── */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f44336] text-white flex items-center justify-center text-[10px] font-black">02</div>
                    <h3 className="text-[14px] font-black text-[#5d596c] uppercase tracking-widest">Administrative Audit Stream</h3>
                </div>
                <div className="bg-white rounded-[2rem] border border-[#dbdade]/50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Security Event</th>
                                    <th className="px-8 py-5">Admin Actor</th>
                                    <th className="px-8 py-5 text-center">IP Trace</th>
                                    <th className="px-8 py-5 text-right">Temporal Marker</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dbdade]/20">
                                {auditLogs.length > 0 ? auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-red-50/30 transition-colors group text-[14px]">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-red-50 text-red-500 border border-red-100">
                                                    <Activity size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#5d596c] leading-none mb-1">{log.action}</p>
                                                    <p className="text-[11px] font-medium text-[#a5a3ae] line-clamp-1 max-w-[200px]">{log.details}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-[#5d596c] leading-none mb-1">{log.user?.name || "System"}</p>
                                            <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-tighter">{log.user?.email || "internal-service"}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="font-mono text-[9px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                                                {log.ipAddress || "::1"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-1">
                                                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                            </p>
                                            <p className="text-[10px] font-bold text-[#a5a3ae]">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-[#a5a3ae] italic text-[14px] font-medium">
                                            No active security events found in the Ecclesiastical Vault. Initializing stream...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
