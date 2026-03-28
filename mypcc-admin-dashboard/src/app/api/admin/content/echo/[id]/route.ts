import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- PATCH: Update Echo Issue --
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await prisma.theEchoIssue.update({
            where: { id: id },
            data: {
                title: body.title,
                issueMonth: body.issueMonth ? new Date(body.issueMonth) : undefined,
                pdfUrl: body.pdfUrl,
                coverUrl: body.coverUrl,
                isFree: body.isFree,
                isFeatured: body.isFeatured,
                excerpt: body.excerpt,
                fullText: body.fullText
            }
        });
        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Echo Update error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- DELETE: Delete Echo Issue --
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.theEchoIssue.delete({ where: { id: id } });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Echo Delete error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- GET: Get Single Echo Issue --
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const issue = await prisma.theEchoIssue.findUnique({
            where: { id: id }
        });
        if (!issue) return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        return NextResponse.json(issue);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
