import AnnouncementForm from "@/components/AnnouncementForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewAnnouncementPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">📢 New Announcement</h2>
            <AnnouncementForm mode="create" />
        </div>
    );
}
