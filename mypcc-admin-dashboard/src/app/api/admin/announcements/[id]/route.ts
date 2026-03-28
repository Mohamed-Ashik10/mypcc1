import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- PATCH: Update Announcement --
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await prisma.announcement.update({
            where: { id: id },
            data: {
                title: body.title,
                content: body.content,
                isActive: body.isActive
            }
        });
        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Announcement Update error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- DELETE: Delete Announcement --
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.announcement.delete({ where: { id: id } });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Announcement Delete error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- GET: Get Single Announcement --
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const announcement = await prisma.announcement.findUnique({
            where: { id: id }
        });
        if (!announcement) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        return NextResponse.json(announcement);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
