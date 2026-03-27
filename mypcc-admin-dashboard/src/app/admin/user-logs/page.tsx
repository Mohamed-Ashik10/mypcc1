import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchFromBackend } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ShieldAlert, Fingerprint, Lock, Zap, Database, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserLogsPage() {
    const [session, users] = await Promise.all([
        getServerSession(authOptions),
        fetchFromBackend<any[]>("/api/admin/users").catch(() => [])
    ]);

    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
        redirect("/admin");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Cryptographic User Logs</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <Fingerprint size={12} className="text-[#6e1799]" />
                        <span>Auditing {users.length} active digital identities within the ecclesiastical vault</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-500/20 rounded-xl animate-pulse">
                    <ShieldAlert size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Super Admin Level Access Required</span>
                </div>
            </div>

            {/* ── ALERTS ─────────────────────────────────────────────────── */}
            <div className="bg-amber-50 border border-amber-200 rounded-[1.5rem] p-6 flex gap-5 items-start">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                    <Lock size={20} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[11px] font-black text-amber-700 uppercase tracking-widest">Bcrypt Cryptographic Notice</h4>
                    <p className="text-[13px] text-amber-800/80 font-medium leading-relaxed">
                        User passwords are encrypted via Bcrypt-256 SALT. The hashes shown below are unidirectional and mathematically impossible to reverse. 
                        This portal is designed for administrative auditing of session activity only.
                    </p>
                </div>
            </div>

            {/* ── DATA TABLE ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-[2rem] border border-[#dbdade]/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8f7fa] border-b border-[#dbdade]/50 text-[11px] font-black text-[#a5a3ae] uppercase tracking-widest">
                                <th className="px-8 py-5">Identity Profile</th>
                                <th className="px-8 py-5 text-center">Encryption Hash</th>
                                <th className="px-8 py-5">Origin / Cluster</th>
                                <th className="px-8 py-5 text-right">System Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dbdade]/20">
                            {(Array.isArray(users) ? users : []).map((user) => {
                                const isActiveSession = false;
                                const sessionExpiry = null;

                                return (
                                    <tr key={user.id} className="hover:bg-[#6e1799]/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6e1799] to-[#9c27b0] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-[#6e1799]/20 group-hover:rotate-6 transition-transform">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <p className="text-[15px] font-black text-[#5d596c] group-hover:text-[#6e1799] transition-colors leading-none mb-1.5">{user.name || "Anonymous Member"}</p>
                                                    <p className="text-[11px] font-bold text-[#a5a3ae] tracking-tight">{user.email}</p>
                                                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-[#6e1799]/5 text-[#6e1799] border border-[#6e1799]/10">
                                                        <Database size={10} /> {user.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 group/hash">
                                                <span className="font-mono text-[10px] text-[#a5a3ae] bg-[#f8f7fa] px-3 py-2 rounded-xl border border-[#dbdade]/50 truncate max-w-[140px] block opacity-60 group-hover/hash:opacity-100 transition-opacity" title={user.password || "OAuth Identity Management"}>
                                                    {user.password ? `${user.password.substring(0, 18)}...` : "SSO-MANAGED-OAUTH"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-[#5d596c] uppercase tracking-widest leading-none">
                                                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#a5a3ae]">
                                                    <Calendar size={12} className="text-[#6e1799]/40" />
                                                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 text-right">
                                            {isActiveSession ? (
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10"></span>
                                                        Directly Online
                                                    </div>
                                                    {sessionExpiry && (
                                                        <p className="text-[10px] font-bold text-[#a5a3ae] uppercase tracking-tighter">
                                                            Vault Token Closes {formatDistanceToNow(new Date(sessionExpiry), { addSuffix: true })}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#f8f7fa] text-[#dbdade] border border-[#dbdade]/30">
                                                    < Zap size={12} />
                                                    Connection Closed
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
