import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EchoDeleteButton from "@/components/EchoDeleteButton";

export const dynamic = "force-dynamic";

export default async function TheEchoPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const userId = (session?.user as any)?.id;
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);
    const isMember = !canModify;

    // Fetch user's active subscription status if they are a member
    const activeSub = isMember ? await prisma.subscription.findFirst({
        where: { userId, status: "ACTIVE" }
    }) : null;

    const hasAccess = !isMember || !!activeSub;

    const issues = await prisma.theEchoIssue.findMany({ orderBy: { issueMonth: "desc" } });

    const latestFree = issues.find(i => i.isFree);

    // ── MEMBER VIEW ──────────────────────────────────────────────────────────
    if (isMember) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">📰 The Echo</h2>
                        <p className="text-muted-foreground mt-1 text-sm">The official newsletter of the Presbyterian Church in Cameroon</p>
                    </div>
                </div>

                {/* Latest Free Issue Hero */}
                {latestFree && (
                    <div className="relative bg-gradient-to-br from-purple-600 to-blue-700 dark:from-purple-700 dark:to-blue-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
                        <p className="text-xs font-bold uppercase tracking-widest text-purple-200 mb-2">Latest Free Issue</p>
                        <p className="text-2xl font-bold mb-1">{latestFree.title}</p>
                        <p className="text-sm text-purple-200 mb-5">
                            {new Date(latestFree.issueMonth).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                        </p>
                        <a
                            href={latestFree.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 font-bold rounded-xl text-sm shadow hover:bg-purple-50 transition-all active:scale-95"
                        >
                            📄 Read Now
                        </a>
                    </div>
                )}

                {/* All Issues Grid */}
                {issues.length === 0 ? (
                    <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                        <p className="text-5xl mb-4 text-muted-foreground/20">📰</p>
                        <p className="text-muted-foreground text-lg">No issues published yet. Check back soon.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">All Issues</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {issues.map((issue) => {
                                const isPaid = !issue.isFree;
                                const canView = issue.isFree || hasAccess;

                                return (
                                    <div key={issue.id} className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all relative group">
                                        {/* Cover / Placeholder */}
                                        {issue.coverUrl ? (
                                            <img src={issue.coverUrl} alt={issue.title} className="w-full h-32 object-cover" />
                                        ) : (
                                            <div className="bg-gradient-to-r from-purple-600/70 to-blue-600/70 h-32 flex items-center justify-center">
                                                <span className="text-4xl">📰</span>
                                            </div>
                                        )}

                                        {/* Locked Overlay */}
                                        {!canView && (
                                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                                <span className="text-2xl mb-2">🔒</span>
                                                <p className="font-bold text-foreground text-sm">Premium Issue</p>
                                                <p className="text-[10px] text-muted-foreground mt-1 px-2">Subscribe to unlock our full archive of The Echo</p>
                                                <Link
                                                    href="/admin/subscriptions"
                                                    className="mt-3 px-3 py-1.5 bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider"
                                                >
                                                    Unlock Now
                                                </Link>
                                            </div>
                                        )}

                                        <div className="p-4">
                                            <h4 className="font-bold text-foreground text-base leading-snug">{issue.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(issue.issueMonth).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${issue.isFree
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                    }`}>
                                                    {issue.isFree ? "Free" : "Premium"}
                                                </span>
                                                {canView ? (
                                                    <a
                                                        href={issue.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Read PDF →
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                                                        🔒 Locked
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CTA for non-free issues */}
                {!hasAccess && issues.some(i => !i.isFree) && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800/40 rounded-2xl p-6 text-center">
                        <p className="text-lg font-bold text-foreground">🔓 Unlock All Issues</p>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">Subscribe to get access to all past and future Echo issues.</p>
                        <Link
                            href="/admin/subscriptions"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow"
                        >
                            View Subscription Plans →
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // ── ADMIN VIEW ───────────────────────────────────────────────────────────
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">📰 The Echo</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{issues.length} issues published</p>
                </div>
                <Link
                    href="/admin/the-echo/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
                >
                    📤 Upload Issue
                </Link>
            </div>

            {issues.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">📰</p>
                    <p className="text-muted-foreground text-lg">No issues published yet.</p>
                    <Link href="/admin/the-echo/new" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Upload the first issue →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-border">
                            {issue.coverUrl ? (
                                <img src={issue.coverUrl} alt={issue.title} className="w-full h-32 object-cover" />
                            ) : (
                                <div className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 h-32 flex items-center justify-center">
                                    <span className="text-5xl">📰</span>
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="font-bold text-foreground text-lg">{issue.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(issue.issueMonth).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${issue.isFree ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                                        {issue.isFree ? "Free" : "Paid"}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                        View PDF →
                                    </a>
                                    <div className="flex items-center gap-3">
                                        <Link href={`/admin/the-echo/${issue.id}/edit`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                            Edit
                                        </Link>
                                        <EchoDeleteButton id={issue.id} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
