import AnnouncementForm from "@/components/AnnouncementForm";
import { fetchFromBackend } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    const { id } = await params;
    
    let announcement: any = null;
    try {
        announcement = await fetchFromBackend(`/api/admin/announcements/${id}`);
    } catch (error) {
        console.error("Failed to fetch announcement from backend. Trying Prisma fallback.", error);
        try {
            announcement = await prisma.announcement.findUnique({
                where: { id: id }
            });
        } catch (dbError) {
            console.error("Announcements DB Fallback failed.", dbError);
        }
    }
    
    if (!announcement) return notFound();

    const initialData = {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        isActive: announcement.isActive,
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">✏️ Edit Announcement</h2>
            <AnnouncementForm mode="edit" initialData={initialData} />
        </div>
    );
}
