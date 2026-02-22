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
                <h2 className="text-3xl font-bold text-gray-800">💳 Subscriptions</h2>
                <p className="text-gray-500 mt-1">{subscriptions.length} total subscriptions</p>
            </div>

            {subscriptions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <p className="text-5xl mb-4">💳</p>
                    <p className="text-gray-500 text-lg">No subscriptions yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3 text-left">Member</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Start</th>
                                <th className="px-6 py-3 text-left">End</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {subscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{sub.user.name ?? "—"}</p>
                                        <p className="text-xs text-gray-400">{sub.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{sub.type.replace(/_/g, " ")}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[sub.status]}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(sub.startDate).toLocaleDateString("en-GB")}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(sub.endDate).toLocaleDateString("en-GB")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
