import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
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
                <h2 className="text-3xl font-bold text-gray-800">👥 Users</h2>
                <p className="text-gray-500 mt-1">{users.length} registered users</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Role</th>
                            <th className="px-6 py-3 text-left">Active Subs</th>
                            <th className="px-6 py-3 text-left">Transactions</th>
                            <th className="px-6 py-3 text-left">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{user.name ?? "—"}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email ?? "—"}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadge[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {user.subscriptions.length > 0
                                        ? user.subscriptions.map((s) => s.type.replace(/_/g, " ")).join(", ")
                                        : <span className="text-gray-400">None</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{user._count.transactions}</td>
                                <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
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
