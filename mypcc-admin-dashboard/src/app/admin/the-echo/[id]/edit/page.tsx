import EchoForm from "@/components/EchoForm";
import { fetchFromBackend } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EditEchoIssuePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    const { id } = await params;
    
    let issue: any = null;
    try {
        issue = await fetchFromBackend(`/api/admin/content/echo/${id}`);
    } catch (error) {
        console.error("Failed to fetch echo issue from backend:", error);
    }
    
    if (!issue) return notFound();

    const initialData = {
        id: issue.id,
        title: issue.title,
        issueMonth: typeof issue.issueMonth === 'string' ? issue.issueMonth : issue.issueMonth.toISOString(),
        pdfUrl: issue.pdfUrl,
        coverUrl: issue.coverUrl ?? "",
        isFree: issue.isFree,
        isFeatured: issue.isFeatured,
        excerpt: issue.excerpt ?? "",
        fullText: issue.fullText ?? "",
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">✏️ Edit Echo Issue</h2>
            <EchoForm mode="edit" initialData={initialData} />
        </div>
    );
}
