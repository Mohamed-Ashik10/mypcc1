"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Calendar, Shield, CreditCard, X } from "lucide-react";

export default function AdminSubscriptionTable({ subscriptions }: { subscriptions: any[] }) {
    const router = useRouter();
    const [editingSub, setEditingSub] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [tier, setTier] = useState("");
    const [status, setStatus] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleEditStart = (sub: any) => {
        setEditingSub(sub);
        setTier(sub.type);
        setStatus(sub.status);
        setEndDate(sub.endDate ? new Date(sub.endDate).toISOString().split('T')[0] : "");
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/subscriptions/${editingSub.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: tier, status, endDate }),
            });
            const data = await res.json();
            if (data.success) {
                setEditingSub(null);
                router.refresh();
            } else {
                alert(data.error || "Update failed");
            }
        } catch (err) {
            alert("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subscription? The user will lose access immediately.")) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/subscriptions/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                router.refresh();
            } else {
                alert(data.error || "Delete failed");
            }
        } catch (err) {
            alert("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const statusBadge: Record<string, string> = {
        ACTIVE: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
        EXPIRED: "bg-muted text-muted-foreground border border-border",
        CANCELLED: "bg-red-500/10 text-red-500 border border-red-500/20",
    };

    const tierColor: Record<string, string> = {
        SEEKER: "text-blue-600",
        PILGRIM: "text-[#6e1799]",
        SHEPHERD: "text-amber-600",
    };

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted px-8 py-5 border-b border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                            <th className="px-8 py-5">Account Holder</th>
                            <th className="px-8 py-5">Plan Tier</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5">Expiration Date</th>
                            <th className="px-8 py-5 text-right">Vault Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {subscriptions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-[#6e1799]/[0.02] transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[#6e1799] font-black text-xs border border-border group-hover:scale-105 transition-transform uppercase">
                                            {sub.user.name ? sub.user.name[0] : '?'}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-black text-foreground leading-none mb-1.5">{sub.user.name ?? "Anonymous"}</p>
                                            <p className="text-[11px] font-bold text-muted-foreground tracking-tight">{sub.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${sub.type === 'SHEPHERD' ? 'bg-amber-500' : (sub.type === 'PILGRIM' ? 'bg-[#6e1799]' : 'bg-blue-500')}`} />
                                        <span className={`text-[12px] font-black uppercase tracking-widest ${tierColor[sub.type] || 'text-slate-500'}`}>
                                            {sub.type.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusBadge[sub.status]}`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                                        <Calendar size={13} />
                                        <span>{new Date(sub.endDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-5">
                                        <button 
                                            onClick={() => handleEditStart(sub)}
                                            className="text-[11px] font-black text-muted-foreground hover:text-[#6e1799] uppercase tracking-widest transition-colors flex items-center gap-2"
                                        >
                                            <Edit2 size={12} />
                                            <span>Edit</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(sub.id)}
                                            className="text-[11px] font-black text-muted-foreground hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 size={12} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* VUE-STYLE MODAL */}
            {editingSub && (
                <div className="fixed inset-0 bg-background/60 backdrop-blur-[3px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-card rounded-[2rem] p-8 max-w-md w-full border border-border shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setEditingSub(null)} className="absolute top-6 right-6 p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#6e1799]/10 rounded-2xl flex items-center justify-center text-[#6e1799] border border-[#6e1799]/10">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-[20px] font-black tracking-tighter uppercase text-foreground leading-none mb-1">Update Vault Record</h3>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Adjusting membership for {editingSub.user.name}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Tier Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block ml-1">Plan Tier</label>
                                <div className="relative">
                                    <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <select 
                                        value={tier} 
                                        onChange={(e) => setTier(e.target.value)}
                                        className="w-full bg-muted/40 border border-border/60 rounded-xl pl-12 pr-4 py-4 text-sm font-black uppercase tracking-widest text-foreground appearance-none focus:outline-none focus:border-[#6e1799] transition-all"
                                    >
                                        <option value="SEEKER" className="bg-card">The Seeker</option>
                                        <option value="PILGRIM" className="bg-card">The Pilgrim</option>
                                        <option value="SHEPHERD" className="bg-card">The Shepherd</option>
                                    </select>
                                </div>
                            </div>

                            {/* Status Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block ml-1">Account Status</label>
                                <div className="relative">
                                    <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <select 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full bg-muted/40 border border-border/60 rounded-xl pl-12 pr-4 py-4 text-sm font-black uppercase tracking-widest text-foreground appearance-none focus:outline-none focus:border-[#6e1799] transition-all"
                                    >
                                        <option value="ACTIVE" className="bg-card">Verified Active</option>
                                        <option value="EXPIRED" className="bg-card">Term Expired</option>
                                        <option value="CANCELLED" className="bg-card">Manually Revoked</option>
                                    </select>
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block ml-1">Expiration Date override</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <input 
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-muted/40 border border-border/60 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-[#6e1799] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setEditingSub(null)}
                                    className="flex-1 p-4 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleUpdate}
                                    disabled={isLoading}
                                    className="flex-1 p-4 rounded-xl bg-[#6e1799] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#6e1799]/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? "Synchronizing..." : "Commit Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
