import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">📢 Announcements</h2>
                    <p className="text-muted-foreground mt-1">{announcements.length} announcements</p>
                </div>
                <Link
                    href="/admin/announcements/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95"
                >
                    📢 New Announcement
                </Link>
            </div>

            {announcements.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">📢</p>
                    <p className="text-muted-foreground text-lg">No announcements posted yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground text-lg">{announcement.title}</h3>
                                    <p className="text-muted-foreground mt-2 text-sm whitespace-pre-line">{announcement.content}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-3">
                                        {new Date(announcement.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ml-4 ${announcement.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                                    {announcement.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
