import EchoForm from "@/components/EchoForm";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EditEchoIssuePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN", "STAFF", "EDITOR"].includes(userRole)) {
        redirect("/admin");
    }
    const { id } = await params;
    const issue = await prisma.theEchoIssue.findUnique({ where: { id } });
    if (!issue) return notFound();

    const initialData = {
        id: issue.id,
        title: issue.title,
        issueMonth: issue.issueMonth.toISOString(),
        pdfUrl: issue.pdfUrl,
        coverUrl: issue.coverUrl ?? "",
        isFree: issue.isFree,
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">✏️ Edit Echo Issue</h2>
            <EchoForm mode="edit" initialData={initialData} />
        </div>
    );
}
