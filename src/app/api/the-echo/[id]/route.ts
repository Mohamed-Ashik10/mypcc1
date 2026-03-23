import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const issue = await prisma.theEchoIssue.findUnique({ where: { id } });
        if (!issue) return NextResponse.json({ error: "Newsletter Not Found" }, { status: 404 });
        return NextResponse.json(issue);
    } catch (error) {
        console.error("Echo GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await request.json();
    try {
        // If this issue is being marked as featured, unfeature all others
        if (body.isFeatured) {
            await prisma.theEchoIssue.updateMany({
                where: { isFeatured: true, id: { not: id } },
                data: { isFeatured: false }
            });
        }

        const issue = await (prisma as any).theEchoIssue.update({
            where: { id },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.pdfUrl && { pdfUrl: body.pdfUrl }),
                ...(body.coverUrl !== undefined && { coverUrl: body.coverUrl }),
                ...(body.images !== undefined && { images: body.images }),
                ...(body.isFree !== undefined && { isFree: body.isFree }),
                ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
                ...(body.issueMonth && { issueMonth: new Date(body.issueMonth) }),
                ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
                ...(body.fullText !== undefined && { fullText: body.fullText }),
                ...(body.category !== undefined && { category: body.category }),
            },
        });
        return NextResponse.json(issue);
    } catch (error) {
        console.error("Echo PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update issue." }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    try {
        await prisma.theEchoIssue.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete issue." }, { status: 500 });
    }
}
