import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, CheckCircle, Clock, CreditCard, ShieldCheck, DollarSign } from "lucide-react";
import { fetchFromBackend } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
    // RUN IN PARALLEL: Session and Financial Data
    const [session, transactionsResponse] = await Promise.all([
        getServerSession(authOptions),
        fetchFromBackend<any[]>("/api/admin/financials/transactions").catch(err => {
            console.error("Failed to fetch transactions:", err);
            return [];
        })
    ]);

    const userRole = (session?.user as any)?.role;
    if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
        redirect("/admin");
    }

    const transactions = transactionsResponse;
    
    // Sort by latest first as Spring DB order might vary
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalRevenue = transactions
        .filter((t) => t.status === "COMPLETED")
        .reduce((sum, t) => sum + t.amount, 0);

    const statusBadge: Record<string, string> = {
        COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
        PENDING: "bg-amber-50 text-amber-600 border-amber-100",
        FAILED: "bg-red-50 text-red-600 border-red-100",
    };

    const methodIcons: Record<string, any> = {
        MOBILE_MONEY: <span className="text-blue-500">📱 M-Money</span>,
        VISA: <span className="text-indigo-600">💳 Visa/Card</span>,
        PAYPAL: <span className="text-blue-700">🅿️ PayPal</span>,
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Ministry Ledger</h2>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                        <Wallet size={12} className="text-[#6e1799]" />
                        <span>Auditing {transactions.length} financial contributions to the digital ministry</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Fiscal Compliance Verified</span>
                </div>
            </div>

            {/* ── SUMMARY CARDS ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#dbdade]/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-[20px] font-black text-[#6e1799] leading-none mb-1">{totalRevenue.toLocaleString()} XAF</p>
                        <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Total Gross Revenue</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#dbdade]/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-[20px] font-black text-[#5d596c] leading-none mb-1">{transactions.filter(t => t.status === "COMPLETED").length}</p>
                        <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Successful Deposits</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#dbdade]/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[20px] font-black text-[#5d596c] leading-none mb-1">{transactions.filter(t => t.status === "PENDING").length}</p>
                        <p className="text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">Pending Invoices</p>
                    </div>
                </div>
            </div>

            {/* ── DATA TABLE ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#dbdade]/50 shadow-sm overflow-hidden">
                {transactions.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-16 h-16 bg-[#f8f7fa] rounded-full flex items-center justify-center mx-auto mb-4 text-[#dbdade]">
                            <CreditCard size={32} />
                        </div>
                        <p className="text-[#a5a3ae] text-[11px] font-black uppercase tracking-widest">No transaction history found in the ledger</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8f7fa] border-b border-[#dbdade]/50 text-[11px] font-black text-[#a5a3ae] uppercase tracking-widest">
                                    <th className="px-8 py-5">Vault Reference</th>
                                    <th className="px-8 py-5">Account Member</th>
                                    <th className="px-8 py-5">Origin/Method</th>
                                    <th className="px-8 py-5 text-right">Value Amount</th>
                                    <th className="px-8 py-5 text-center">Final Status</th>
                                    <th className="px-8 py-5 text-right">Ledger Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dbdade]/30">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-[#6e1799]/[0.02] transition-colors group text-[13px]">
                                        <td className="px-8 py-5 font-mono text-[11px] text-[#a5a3ae] uppercase tracking-tighter">
                                            #{tx.reference.substring(0, 12)}...
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-[#5d596c] leading-none mb-1 group-hover:text-[#6e1799] transition-colors">{tx.user.name ?? "Anonymous"}</p>
                                            <p className="text-[11px] font-bold text-[#a5a3ae] tracking-tight">{tx.user.email}</p>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-[#5d596c] uppercase text-[10px] tracking-widest">
                                            {methodIcons[tx.paymentMethod] || tx.paymentMethod}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <p className="font-black text-[#5d596c] tabular-nums">{tx.amount.toLocaleString()} XAF</p>
                                            <p className="text-[10px] font-bold text-[#a5a3ae] uppercase leading-none mt-1">Confirmed Growth</p>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusBadge[tx.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right text-[#a5a3ae] font-bold">
                                            {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
