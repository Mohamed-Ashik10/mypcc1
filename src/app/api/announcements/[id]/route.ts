import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH update an announcement (ADMIN / STAFF only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if (!["ADMIN", "STAFF"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    try {
        const body = await request.json();
        const announcement = await prisma.announcement.update({
            where: { id },
            data: {
                title: body.title,
                content: body.content,
                isActive: body.isActive ?? true,
            },
        });
        return NextResponse.json(announcement);
    } catch {
        return NextResponse.json({ error: "Failed to update announcement." }, { status: 500 });
    }
}

// DELETE an announcement (ADMIN / STAFF only)
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if (!["ADMIN", "STAFF"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    try {
        await prisma.announcement.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete announcement." }, { status: 500 });
    }
}
