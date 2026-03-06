import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
        redirect("/admin");
    }

    const transactions = await prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
    });

    const totalRevenue = transactions
        .filter((t) => t.status === "COMPLETED")
        .reduce((sum, t) => sum + t.amount, 0);

    const statusBadge: Record<string, string> = {
        COMPLETED: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        FAILED: "bg-red-100 text-red-600",
    };

    const methodIcon: Record<string, string> = {
        MOBILE_MONEY: "📱",
        VISA: "💳",
        PAYPAL: "🅿️",
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">💰 Transactions</h2>
                <p className="text-muted-foreground mt-1">{transactions.length} records</p>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl shadow-lg p-6 border border-white/10">
                    <p className="text-sm text-green-100">Total Revenue</p>
                    <p className="text-3xl font-bold mt-1">{totalRevenue.toLocaleString("fr-CM")} XAF</p>
                </div>
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{transactions.filter(t => t.status === "COMPLETED").length}</p>
                </div>
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{transactions.filter(t => t.status === "PENDING").length}</p>
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">💰</p>
                    <p className="text-muted-foreground text-lg">No transactions yet.</p>
                </div>
            ) : (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3 text-left">Reference</th>
                                <th className="px-6 py-3 text-left">Member</th>
                                <th className="px-6 py-3 text-left">Method</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground/60">{tx.reference}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-foreground">{tx.user.name ?? "—"}</p>
                                        <p className="text-xs text-muted-foreground/60">{tx.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {methodIcon[tx.paymentMethod] ?? ""} {tx.paymentMethod.replace(/_/g, " ")}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-foreground">
                                        {tx.amount.toLocaleString("fr-CM")} {tx.currency}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[tx.status]} ${tx.status === 'COMPLETED' ? 'dark:bg-green-900/30 dark:text-green-400' : tx.status === 'PENDING' ? 'dark:bg-yellow-900/30 dark:text-yellow-400' : ''}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground/60 whitespace-nowrap">
                                        {new Date(tx.createdAt).toLocaleDateString("en-GB")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
