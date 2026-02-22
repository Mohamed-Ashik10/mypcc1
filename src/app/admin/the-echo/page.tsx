import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TheEchoPage() {
    const issues = await prisma.theEchoIssue.findMany({ orderBy: { issueMonth: "desc" } });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">📰 The Echo</h2>
                    <p className="text-muted-foreground mt-1">{issues.length} issues published</p>
                </div>
                <Link
                    href="/admin/the-echo/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95"
                >
                    📤 Upload Issue
                </Link>
            </div>

            {issues.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">📰</p>
                    <p className="text-muted-foreground text-lg">No issues published yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-card text-card-foreground rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-border">
                            <div className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 h-32 flex items-center justify-center">
                                <span className="text-5xl">📰</span>
                            </div>
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
                                <div className="mt-4 flex items-center gap-3">
                                    <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                        View PDF →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
