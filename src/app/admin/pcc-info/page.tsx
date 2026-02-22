import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PccInfoPage() {
    const sections = await prisma.pccInfo.findMany({ orderBy: { section: "asc" } });

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">ℹ️ PCC Information</h2>
                <p className="text-gray-500 mt-1">Manage public-facing information about the Presbyterian Church in Cameroon.</p>
            </div>

            {sections.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <p className="text-5xl mb-4">ℹ️</p>
                    <p className="text-gray-500 text-lg">No information sections configured yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Add sections via the API (e.g. &quot;About&quot;, &quot;History&quot;, &quot;Leadership&quot;).</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections.map((s) => (
                        <div key={s.id} className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="font-bold text-gray-800 text-lg capitalize">{s.section}</h3>
                            <p className="text-gray-600 mt-3 text-sm whitespace-pre-line">{s.content}</p>
                            <p className="text-xs text-gray-400 mt-3">
                                Last updated: {new Date(s.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
