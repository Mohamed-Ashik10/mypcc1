import prisma from "@/lib/prisma";
import Link from "next/link";
import DevotionalDeleteButton from "@/components/DevotionalDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DevotionalsPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);

    const devotionals = await prisma.devotional.findMany({ orderBy: { date: "desc" }, take: 50 });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">🙏 Devotionals</h2>
                    <p className="text-muted-foreground mt-1">{devotionals.length} devotionals</p>
                </div>
                {canModify && (
                    <Link
                        href="/admin/devotionals/new"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
                    >
                        ➕ New Devotional
                    </Link>
                )}
            </div>

            {devotionals.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">🙏</p>
                    <p className="text-muted-foreground text-lg">No devotionals published yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {devotionals.map((d) => (
                        <div key={d.id} className="bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground">{d.title}</h3>
                                    <p className="text-sm text-muted-foreground/60 mt-1">
                                        {new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                                        {d.author && <> · By <span className="text-muted-foreground">{d.author}</span></>}
                                    </p>
                                    <p className="text-muted-foreground mt-3 text-sm line-clamp-3">{d.content}</p>
                                </div>
                                <div className="ml-4">
                                    {canModify && <DevotionalDeleteButton id={d.id} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
