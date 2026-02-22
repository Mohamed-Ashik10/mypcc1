import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
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
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">💳 Subscriptions</h2>
                <p className="text-muted-foreground mt-1">{subscriptions.length} total subscriptions</p>
            </div>

            {subscriptions.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">💳</p>
                    <p className="text-muted-foreground text-lg">No subscriptions yet.</p>
                </div>
            ) : (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden border border-border">
                    <table className="w-full text-sm">
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
            )}
        </div>
    );
}
