import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AnnouncementDeleteButton from "@/components/AnnouncementDeleteButton";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const canModify = ["ADMIN_STAFF", "SUPER_ADMIN", "CONTENT_EDITOR"].includes(userRole);

    const where = canModify ? {} : { isActive: true };
    const announcements = await prisma.announcement.findMany({
        where,
        orderBy: { createdAt: "desc" }
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">📢 Announcements</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{announcements.length} announcements</p>
                </div>
                {canModify && (
                    <Link
                        href="/admin/announcements/new"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
                    >
                        📢 New Announcement
                    </Link>
                )}
            </div>

            {announcements.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-2xl shadow-md p-12 text-center border border-border">
                    <p className="text-5xl mb-4 text-muted-foreground/20">📢</p>
                    <p className="text-muted-foreground text-lg">No announcements posted yet.</p>
                    {canModify && (
                        <Link href="/admin/announcements/new" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Post the first announcement →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-card text-card-foreground rounded-2xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-foreground text-lg">{announcement.title}</h3>
                                    <p className="text-muted-foreground mt-2 text-sm whitespace-pre-line line-clamp-3">{announcement.content}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-3">
                                        {new Date(announcement.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-3 shrink-0">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${announcement.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                                        {announcement.isActive ? "Active" : "Inactive"}
                                    </span>
                                    {canModify && (
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/admin/announcements/${announcement.id}/edit`}
                                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <AnnouncementDeleteButton id={announcement.id} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
