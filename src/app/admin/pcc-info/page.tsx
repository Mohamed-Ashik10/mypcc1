import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PccInfoPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN", "STAFF"].includes(userRole)) {
        redirect("/admin");
    }

    const sections = await prisma.pccInfo.findMany({ orderBy: { section: "asc" } });

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">ℹ️ PCC Information</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Manage public-facing information about the Presbyterian Church in Cameroon.</p>
                </div>
            </div>

            {sections.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">ℹ️</p>
                    <p className="text-muted-foreground text-lg">No information sections configured yet.</p>
                    <p className="text-sm text-muted-foreground/40 mt-2">Add sections via the API (e.g. &quot;About&quot;, &quot;History&quot;, &quot;Leadership&quot;).</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections.map((s) => (
                        <div key={s.id} className="bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
                            <h3 className="font-bold text-foreground text-lg capitalize">{s.section}</h3>
                            <p className="text-muted-foreground mt-3 text-sm whitespace-pre-line">{s.content}</p>
                            <p className="text-xs text-muted-foreground/60 mt-3">
                                Last updated: {new Date(s.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
