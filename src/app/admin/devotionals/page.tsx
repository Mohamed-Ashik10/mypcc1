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

    const devotionals = (await prisma.devotional.findMany({ orderBy: { date: "desc" }, take: 50 })) as any[];

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
                    {devotionals.map((d) => {
                        const isQueued = new Date(d.date) > new Date();
                        
                        return (
                        <div key={d.id} className="relative overflow-hidden bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
                            {/* Insert background image with a massive fade so it doesn't block text */}
                            {d.image && (
                                <div 
                                    className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.1]" 
                                    style={{
                                        backgroundImage: `url(${d.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                            )}
                            <div className="relative z-10 flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        {d.image && (
                                            <div 
                                                className="w-10 h-10 rounded-lg shadow-sm bg-cover bg-center border border-border"
                                                style={{ backgroundImage: `url(${d.image})` }}
                                            />
                                        )}
                                        <h3 className="font-bold text-foreground text-lg">{d.title}</h3>
                                        {isQueued && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-500/20">
                                                ⏳ Queued
                                            </span>
                                        )}
                                        {!d.isFree && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-400 rounded-lg border border-purple-200 dark:border-purple-500/20">
                                                🔒 {d.minPlan === 'SHEPHERD' ? 'Shepherd' : 'Pilgrim'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground/80 mt-2 font-medium">
                                        🗓️ {new Date(d.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                                        {d.author && <> · ✍️ <span className="text-muted-foreground">{d.author}</span></>}
                                    </p>
                                    <p className="text-muted-foreground/90 mt-3 text-sm line-clamp-2 leading-relaxed max-w-3xl">{(d as any).excerpt || d.content.substring(0, 150)}</p>
                                </div>
                                <div className="ml-4 pl-4 border-l border-border/50">
                                    {canModify && <DevotionalDeleteButton id={d.id} />}
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}
        </div>
    );
}
