import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "USER";
    const userId = (session?.user as any)?.id;
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "STAFF"].includes(userRole);

    if (isAdmin) {
        const subscriptions = await prisma.subscription.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        const statusBadge: Record<string, string> = {
            ACTIVE: "bg-green-100 text-green-700",
            EXPIRED: "bg-gray-100 text-gray-500",
            CANCELLED: "bg-red-100 text-red-600",
        };

        return (
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">💳 Subscriptions Management</h2>
                        <p className="text-muted-foreground mt-1 text-sm">{subscriptions.length} total across the platform</p>
                    </div>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                        <p className="text-5xl mb-4 text-muted-foreground/20">💳</p>
                        <p className="text-muted-foreground text-lg">No subscriptions yet.</p>
                    </div>
                ) : (
                    <div className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden border border-border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[700px]">
                                <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Member</th>
                                        <th className="px-6 py-3 text-left">Type</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Start</th>
                                        <th className="px-6 py-3 text-left">End</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-foreground">{sub.user.name ?? "—"}</p>
                                                <p className="text-xs text-muted-foreground/60">{sub.user.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{sub.type.replace(/_/g, " ")}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[sub.status]} ${sub.status === 'ACTIVE' ? 'dark:bg-green-900/30 dark:text-green-400' : ''}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground/60 whitespace-nowrap">{new Date(sub.startDate).toLocaleDateString("en-GB")}</td>
                                            <td className="px-6 py-4 text-muted-foreground/60 whitespace-nowrap">{new Date(sub.endDate).toLocaleDateString("en-GB")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── MEMBER VIEW ──────────────────────────────────────────────────────────
    const userSubscription = await prisma.subscription.findFirst({
        where: { userId, status: "ACTIVE" },
        orderBy: { endDate: "desc" },
    });

    const plans = [
        {
            type: "MONTHLY",
            name: "Monthly",
            price: 1000,
            duration: "30 Days",
            features: ["Full Church Diary Access", "Latest Echo Issue PDF", "Announcements notifications"],
            color: "from-blue-500 to-blue-600",
        },
        {
            type: "QUARTERLY",
            name: "Quarterly",
            price: 2500,
            duration: "90 Days",
            features: ["All Monthly features", "Past Echo Issues access", "Hymn downloads (future)"],
            color: "from-purple-500 to-purple-600",
            recommended: true,
        },
        {
            type: "YEARLY",
            name: "Yearly",
            price: 9000,
            duration: "365 Days",
            features: ["All Quarterly features", "Significant savings", "Priority support"],
            color: "from-emerald-500 to-emerald-600",
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-4 px-4 sm:px-0">
            <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">Support PCC Ministry</h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto font-medium">
                    Subscribe to unlock premium content like The Echo archives and support our digital mission.
                </p>
            </div>

            {/* Current Status */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
                {userSubscription && (
                    <div className="absolute top-0 right-0 py-1.5 px-8 bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] transform rotate-45 translate-x-8 translate-y-2 shadow-lg">
                        Active
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-1">Your Status</h3>
                    {userSubscription ? (
                        <div>
                            <p className="text-2xl font-bold text-foreground">Active {userSubscription.type.replace(/_/g, " ")} Plan</p>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                                Valid until {new Date(userSubscription.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-2xl font-bold text-foreground">No Active Subscription</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Choose a plan below to get started</p>
                        </div>
                    )}
                </div>
                {!userSubscription && (
                    <div className="bg-blue-600/10 text-blue-600 p-4 rounded-2xl">
                        <span className="text-3xl">🛡️</span>
                    </div>
                )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.type}
                        className={`bg-card border-2 rounded-[32px] p-6 flex flex-col relative transition-all hover:translate-y-[-8px] hover:shadow-2xl ${plan.recommended ? "border-purple-500 shadow-xl scale-105" : "border-border shadow-md"
                            }`}
                    >
                        {plan.recommended && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </span>
                        )}

                        <div className="mb-6">
                            <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">{plan.name}</h4>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-foreground">{plan.price.toLocaleString()}</span>
                                <span className="text-sm font-bold text-muted-foreground">XAF / {plan.duration}</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground/80 leading-snug">
                                    <span className="text-blue-500 mt-0.5">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={`/admin/subscriptions/checkout?plan=${plan.type}`}
                            className={`w-full py-4 rounded-2xl text-sm font-black text-white text-center transition-all active:scale-95 shadow-lg shadow-blue-500/20 bg-gradient-to-br ${plan.color}`}
                        >
                            Select Plan
                        </Link>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                By subscribing, you agree to our Terms of Service. Payments are processed securely via mock mobile money gateway for this demonstration.
            </p>
        </div>
    );
}
