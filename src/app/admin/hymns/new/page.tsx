import HymnForm from "@/components/HymnForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewHymnPage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">🎵 Add Hymn</h2>
            <HymnForm mode="create" />
        </div>
    );
}
