import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- PATCH: Update Diary Entry --
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await prisma.diaryEntry.update({
            where: { id: id },
            data: {
                date: body.date ? new Date(body.date) : undefined,
                title: body.title,
                theme: body.theme,
                readingOne: body.readingOne,
                readingTwo: body.readingTwo,
                readingThree: body.readingThree,
                body: body.body,
                hymn: body.hymn,
                isFree: body.isFree ?? undefined,
                minPlan: body.minPlan ?? undefined,
            }
        });
        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Diary Update error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- DELETE: Delete Diary Entry --
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.diaryEntry.delete({ where: { id: id } });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Diary Delete error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- GET: Get Single Diary Entry --
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const entry = await prisma.diaryEntry.findUnique({
            where: { id: id }
        });
        if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        return NextResponse.json(entry);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
