import HymnForm from "@/components/HymnForm";
import { fetchFromBackend } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EditHymnPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    const { id } = await params;
    
    let hymn: any = null;
    try {
        hymn = await fetchFromBackend(`/api/admin/content/hymns/${id}`);
    } catch (error) {
        console.error("Failed to fetch hymn from backend:", error);
    }
    
    if (!hymn) return notFound();

    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">✏️ Edit Hymn #{hymn.number}</h2>
            <HymnForm
                mode="edit"
                initialData={{
                    id: hymn.id,
                    number: String(hymn.number),
                    title: hymn.title,
                    lyrics: hymn.lyrics,
                    author: hymn.author || "",
                    tags: hymn.tags || "",
                    tuneUrl: hymn.tuneUrl || "",
                } as any}
            />
        </div>
    );
}
