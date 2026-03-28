import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- PATCH: Update Hymn --
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await prisma.hymn.update({
            where: { id: id },
            data: {
                number: body.number ? parseInt(body.number) : undefined,
                title: body.title,
                lyrics: body.lyrics,
                author: body.author,
                tags: body.tags,
                tuneUrl: body.tuneUrl
            }
        });
        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Update Hymn DB error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- DELETE: Delete Hymn --
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.hymn.delete({ where: { id: id } });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Delete Hymn DB error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- GET: Get Single Hymn --
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const hymn = await prisma.hymn.findUnique({
            where: { id: id }
        });
        if (!hymn) return NextResponse.json({ error: "Hymn not found" }, { status: 404 });
        return NextResponse.json(hymn);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
