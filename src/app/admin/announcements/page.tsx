import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">📢 Announcements</h2>
                    <p className="text-gray-500 mt-1">{announcements.length} announcements</p>
                </div>
                <Link
                    href="/admin/announcements/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-500 transition"
                >
                    📢 New Announcement
                </Link>
            </div>

            {announcements.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <p className="text-5xl mb-4">📢</p>
                    <p className="text-gray-500 text-lg">No announcements posted yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg">{announcement.title}</h3>
                                    <p className="text-gray-600 mt-2 text-sm whitespace-pre-line">{announcement.content}</p>
                                    <p className="text-xs text-gray-400 mt-3">
                                        {new Date(announcement.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ml-4 ${announcement.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
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
