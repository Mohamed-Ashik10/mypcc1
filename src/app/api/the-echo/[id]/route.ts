import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    try {
        const issue = await prisma.theEchoIssue.update({
            where: { id },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.pdfUrl && { pdfUrl: body.pdfUrl }),
                ...(body.coverUrl !== undefined && { coverUrl: body.coverUrl }),
                ...(body.isFree !== undefined && { isFree: body.isFree }),
                ...(body.issueMonth && { issueMonth: new Date(body.issueMonth) }),
            },
        });
        return NextResponse.json(issue);
    } catch {
        return NextResponse.json({ error: "Failed to update issue." }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.theEchoIssue.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete issue." }, { status: 500 });
    }
}
