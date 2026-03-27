import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a single diary entry
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // Try backend first for official entries
        const entry = await fetchFromBackend<any>(`/api/admin/diary/${id}`);
        if (entry) return NextResponse.json(entry);
    } catch (e) {}

    // Fallback to local Prisma (for personal entries)
    const local = await prisma.diaryEntry.findUnique({ where: { id } });
    if (!local) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(local);
}

// PATCH update a diary entry
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // Check if it's an official entry (exists in backend or has no userId locally)
    const local = await prisma.diaryEntry.findUnique({ where: { id } });
    
    if (!local || !local.userId) {
        // Official Entry -> Backend
        const role = (session?.user as any)?.role;
        if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
            return NextResponse.json({ error: "Forbidden: Only admins can edit official entries." }, { status: 403 });

        if (body.date) {
            body.date = new Date(body.date).toISOString();
        }

        const updated = await fetchFromBackend<any>(`/api/admin/diary/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
        return NextResponse.json(updated);
    }

    // Personal Entry -> Local Prisma
    if (local.userId !== (session.user as any).id)
        return NextResponse.json({ error: "Forbidden: You don't have permission to edit this entry." }, { status: 403 });

    const updated = await prisma.diaryEntry.update({
        where: { id },
        data: {
            ...body,
            ...(body.date && { date: new Date(body.date) }),
        },
    });
    return NextResponse.json(updated);
}

// DELETE a diary entry
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { id } = await params;
    const local = await prisma.diaryEntry.findUnique({ where: { id } });

    if (!local || !local.userId) {
        // Official Entry -> Backend
        const role = (session?.user as any)?.role;
        if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
            return NextResponse.json({ error: "Forbidden: Only admins can delete official entries." }, { status: 403 });

        await fetchFromBackend<any>(`/api/admin/diary/${id}`, {
            method: "DELETE",
        });
        return NextResponse.json({ success: true });
    }

    // Personal Entry -> Local Prisma
    if (local.userId !== (session.user as any).id)
        return NextResponse.json({ error: "Forbidden: You don't have permission to delete this entry." }, { status: 403 });

    await prisma.diaryEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
