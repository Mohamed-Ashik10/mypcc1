import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

import EchoAudioPlayer from "@/components/EchoAudioPlayer";

export const dynamic = "force-dynamic";

export default async function EchoIssueViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const userId = (session?.user as any)?.id;
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);
    const isMember = !canModify;

    const issue = await prisma.theEchoIssue.findUnique({ where: { id } });
    if (!issue) return notFound();

    // Check subscription for members
    const activeSub = isMember
        ? await prisma.subscription.findFirst({ where: { userId, status: "ACTIVE" } })
        : null;
    const hasAccess = !isMember || issue.isFree || !!activeSub;

    const formattedDate = new Date(issue.issueMonth).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* ── Back Navigation ── */}
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/the-echo"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to The Echo
                </Link>
            </div>

            {/* ── Hero Header ── */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
                {issue.coverUrl ? (
                    <img
                        src={issue.coverUrl}
                        alt={issue.title}
                        className="w-full h-56 object-cover"
                    />
                ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-purple-700 via-blue-700 to-indigo-800 flex items-center justify-center">
                        <span className="text-7xl opacity-70">📰</span>
                    </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            issue.isFree
                                ? "bg-green-500/90 text-white"
                                : "bg-orange-500/90 text-white"
                        }`}>
                            {issue.isFree ? "Free" : "Premium"}
                        </span>
                        {issue.isFeatured && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/90 text-white">
                                ★ Featured
                            </span>
                        )}
                        <span className="text-xs text-white/70 capitalize">{issue.category || "News"}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{issue.title}</h1>
                    <p className="text-white/70 text-sm mt-1">
                        {formattedDate}
                        {issue.author && issue.author !== "Admin" && ` · by ${issue.author}`}
                    </p>
                </div>
                {/* Admin Edit Button */}
                {canModify && (
                    <div className="absolute top-4 right-4">
                        <Link
                            href={`/admin/the-echo/${id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-semibold rounded-lg transition-all"
                        >
                            ✏️ Edit
                        </Link>
                    </div>
                )}
            </div>

            {/* ── Access Denied Banner (Members without subscription) ── */}
            {!hasAccess && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800/40 rounded-2xl p-6 text-center">
                    <p className="text-3xl mb-3">🔒</p>
                    <p className="text-lg font-bold text-foreground">Premium Issue</p>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Subscribe to unlock this issue and get access to all past and future Echo editions.
                    </p>
                    <Link
                        href="/admin/subscriptions"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow"
                    >
                        View Subscription Plans →
                    </Link>
                </div>
            )}

            {hasAccess && (
                <>
                    {/* ── Audio Narrator (Admin Beta) ── */}
                    {issue.fullText && (
                        <EchoAudioPlayer 
                            title={issue.title}
                            fullText={issue.fullText}
                        />
                    )}

                    {/* ── Excerpt ── */}
                    {issue.excerpt && (
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Summary</h2>
                            <p className="text-foreground leading-relaxed text-base italic">{issue.excerpt}</p>
                        </div>
                    )}

                    {/* ── Full Text Content ── */}
                    {issue.fullText && (
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Full Article</h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-line">
                                {issue.fullText}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
