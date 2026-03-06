import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET a single diary entry
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const entry = await prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(entry);
}

// PATCH update a diary entry (ADMIN / STAFF only)
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
    try {
        const body = await request.json();
        const entry = await prisma.diaryEntry.update({
            where: { id },
            data: {
                title: body.title,
                readingOne: body.readingOne,
                readingTwo: body.readingTwo,
                readingThree: body.readingThree,
                theme: body.theme,
                ...(body.date && { date: new Date(body.date) }),
            },
        });
        return NextResponse.json(entry);
    } catch {
        return NextResponse.json({ error: "Failed to update entry." }, { status: 500 });
    }
}

// DELETE a diary entry (ADMIN / STAFF only)
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
        await prisma.diaryEntry.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete entry." }, { status: 500 });
    }
}
