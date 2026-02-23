import AnnouncementForm from "@/components/AnnouncementForm";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({ where: { id } });
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
