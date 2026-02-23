import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN", "STAFF"].includes(userRole)) {
        redirect("/admin");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            subscriptions: { where: { status: "ACTIVE" }, select: { type: true, endDate: true } },
            _count: { select: { transactions: true } },
        },
    });

    const roleBadge: Record<string, string> = {
        ADMIN: "bg-red-100 text-red-700",
        STAFF: "bg-blue-100 text-blue-700",
        MEMBER: "bg-gray-100 text-gray-600",
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">👥 Users</h2>
                <p className="text-muted-foreground mt-1">{users.length} registered users</p>
            </div>

            <div className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden border border-border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Role</th>
                            <th className="px-6 py-3 text-left">Active Subs</th>
                            <th className="px-6 py-3 text-left">Transactions</th>
                            <th className="px-6 py-3 text-left">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">{user.name ?? "—"}</td>
                                <td className="px-6 py-4 text-muted-foreground">{user.email ?? "—"}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadge[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {user.subscriptions.length > 0
                                        ? user.subscriptions.map((s) => s.type.replace(/_/g, " ")).join(", ")
                                        : <span className="text-muted-foreground/50">None</span>}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{user._count.transactions}</td>
                                <td className="px-6 py-4 text-muted-foreground/60 whitespace-nowrap">
                                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
