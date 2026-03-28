import DiaryForm from "@/components/DiaryForm";
import { fetchFromBackend } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function EditDiaryEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    const { id } = await params;
    
    let entry: any = null;
    try {
        entry = await fetchFromBackend(`/api/admin/diary/${id}`);
    } catch (error) {
        console.error("Failed to fetch diary entry from backend. Trying Prisma fallback.", error);
        try {
            entry = await prisma.diaryEntry.findUnique({
                where: { id: id }
            });
        } catch (dbError) {
            console.error("Diary DB Fallback failed.", dbError);
        }
    }
    
    if (!entry) return notFound();

    const initialData = {
        id: entry.id,
        date: typeof entry.date === 'string' ? entry.date : entry.date.toISOString(),
        title: entry.title ?? "",
        theme: entry.theme ?? "",
        readingOne: entry.readingOne ?? "",
        readingTwo: entry.readingTwo ?? "",
        readingThree: entry.readingThree ?? "",
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">✏️ Edit Diary Entry</h2>
            <DiaryForm mode="edit" initialData={initialData} />
        </div>
    );
}
