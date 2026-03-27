import { fetchFromBackend } from "@/lib/api";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSubscriptionTable from "@/components/AdminSubscriptionTable";
import { CreditCard, ShieldCheck, TrendingUp, Gem } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const userId = (session?.user as any)?.id;
    const isAdmin = ["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole);

    if (isAdmin) {
        let subscriptions: any[] = [];
        try {
            subscriptions = await fetchFromBackend<any[]>("/api/admin/subscriptions");
        } catch (error) {
            console.error("Failed to fetch subscriptions from Spring Boot:", error);
        }

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* ── ADMIN HEADER ────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[26px] font-black text-[#6e1799] tracking-tighter uppercase leading-none mb-2">Member Tiers & Billing</h2>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#a5a3ae] uppercase tracking-widest">
                            <ShieldCheck size={12} className="text-[#6e1799]" />
                            <span>Audit and manage all active digital ministry contributions</span>
                        </div>
                    </div>
                </div>

                {/* ── ADMIN STATS ────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
                        <div className="w-12 h-12 bg-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-500">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[20px] font-black text-foreground leading-none mb-1">{subscriptions.filter(s => s.status === 'ACTIVE').length}</p>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Active Memberships</p>
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 border-l-4 border-l-[#6e1799]">
                        <div className="w-12 h-12 bg-[#6e1799]/5 rounded-xl flex items-center justify-center text-[#6e1799]">
                            <Gem size={24} />
                        </div>
                        <div>
                            <p className="text-[20px] font-black text-foreground leading-none mb-1">
                                {subscriptions.filter(s => s.type === 'SHEPHERD').length}
                            </p>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Shepherd Patrons</p>
                        </div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 border-l-4 border-l-blue-500">
                        <div className="w-12 h-12 bg-blue-500/5 rounded-xl flex items-center justify-center text-blue-500">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-[20px] font-black text-foreground leading-none mb-1">
                                {subscriptions.length}
                            </p>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total History</p>
                        </div>
                    </div>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border shadow-sm p-24 text-center">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard size={32} className="text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">No membership records found in the vault</p>
                    </div>
                ) : (
                    <AdminSubscriptionTable subscriptions={JSON.parse(JSON.stringify(subscriptions))} />
                )}
            </div>
        );
    }

    // ── MEMBER VIEW (Elegant Library Design) ──────────────────────────────────
    let userSubscription: any = null;
    if (userId) {
        try {
            const userSubs = await fetchFromBackend<any[]>(`/api/admin/subscriptions/user/${userId}`);
            userSubscription = userSubs
                .filter(s => s.status === "ACTIVE")
                .sort((a,b) => {
                    const dateA = new Date(a.endDate).getTime();
                    const dateB = new Date(b.endDate).getTime();
                    return dateB - dateA;
                })[0] || null;
        } catch (error) {
            console.error("Failed to fetch user subscription from Spring Boot:", error);
        }
    }

    const plans = [
        {
            type: "SEEKER",
            name: "The Seeker",
            price: 1500,
            duration: "Monthly",
            features: ["Access to 200 Hymns", "Latest Echo Issue (Current)", "Personal Church Diary"],
            color: "from-blue-600 to-indigo-700",
            level: 1
        },
        {
            type: "PILGRIM",
            name: "The Pilgrim",
            price: 4500,
            duration: "Monthly",
            features: ["Access to 400 Hymns", "Complete Echo Archives", "Personal Church Diary"],
            color: "from-[#6e1799] to-[#4e0779]",
            recommended: true,
            level: 2
        },
        {
            type: "SHEPHERD",
            name: "The Shepherd",
            price: 12000,
            duration: "Monthly",
            features: ["Unlimited Hymn Access", "Complete Echo Archives", "Personal Church Diary", "Priority Support & Updates"],
            color: "from-amber-600 to-orange-700",
            level: 3
        },
    ];

    const currentLevel = userSubscription ? plans.find(p => p.type === userSubscription.type)?.level || 0 : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-8 px-4 animate-in fade-in duration-700">
            {/* Elegant Header */}
            <div className="text-center space-y-4">
                <div className="relative inline-block mb-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#6e1799] to-amber-500 blur-sm opacity-20"></div>
                    <div className="relative text-[2.8rem] tracking-widest font-light text-foreground" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                        THE <span className="italic text-[#6e1799] font-medium tracking-tight">CANTICLE</span> JOURNEY
                    </div>
                </div>
                <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] mt-2">Personal Membership & Spiritual Growth</h2>
                <div className="w-16 h-px bg-[#6e1799]/30 mx-auto mt-6"></div>
            </div>

            {/* Current Portfolio */}
            {userSubscription && (
                <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6e1799]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                    <div className="flex items-center gap-6 text-center md:text-left relative z-10">
                        <div className="w-16 h-16 bg-[#6e1799]/5 rounded-2xl flex items-center justify-center text-[#6e1799] border border-[#6e1799]/10">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Standing</p>
                            <h3 className="text-[22px] font-black text-foreground tracking-tight leading-none mb-1">You are on the <span className="text-[#6e1799]">{userSubscription.type}</span> Tier</h3>
                            <p className="text-[12px] text-muted-foreground/60 font-medium italic">Membership verified through {new Date(userSubscription.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Link href="/subscriptions/checkout" className="px-8 py-4 bg-[#6e1799] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-[#6e1799]/20 hover:-translate-y-1 transition-all relative z-10">
                        Change Plan
                    </Link>
                </div>
            )}

            {/* Tiers Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                {plans.map((plan) => {
                    const isCurrent = userSubscription?.type === plan.type;
                    const isUpgrade = plan.level > currentLevel;

                    return (
                        <div key={plan.type} className={`relative group flex flex-col bg-card rounded-[2.5rem] p-10 border transition-all duration-300 ${isCurrent ? 'ring-2 ring-[#6e1799] border-transparent shadow-2xl' : 'border-border hover:border-[#6e1799]/30 hover:shadow-xl hover:-translate-y-2'}`}>
                            {plan.recommended && !isCurrent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6e1799] text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">Recommended Choice</span>}
                            {isCurrent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-muted-foreground text-card px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">Current Selection</span>}
                            
                            <div className="mb-8">
                                <h4 className="text-[18px] font-bold text-foreground mb-6 uppercase tracking-widest" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{plan.name}</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[42px] font-black text-foreground tracking-tighter leading-none">{plan.price.toLocaleString()}</span>
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase">XAF / mo</span>
                                </div>
                            </div>

                            <ul className="flex-1 space-y-5 mb-10">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[13px] text-foreground font-medium leading-relaxed">
                                        <div className="w-5 h-5 bg-[#6e1799]/5 rounded-full flex items-center justify-center text-[#6e1799] border border-[#6e1799]/10">
                                            <ShieldCheck size={12} />
                                        </div>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                href={`/subscriptions/checkout?plan=${plan.type}`}
                                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-center transition-all ${isCurrent 
                                    ? 'bg-muted text-muted-foreground cursor-default' 
                                    : (plan.recommended ? 'bg-[#6e1799] text-white shadow-lg shadow-[#6e1799]/30 hover:scale-[1.02]' : 'bg-foreground text-background hover:bg-[#6e1799] shadow-lg hover:shadow-[#6e1799]/30 hover:text-white')
                                }`}
                            >
                                {isCurrent ? 'Active Journey' : (isUpgrade ? 'Upgrade Seat' : 'Change Plan')}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
