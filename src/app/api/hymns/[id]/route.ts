import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const hymn = await prisma.hymn.findUnique({ where: { id } });
    if (!hymn) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(hymn);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const hymn = await prisma.hymn.update({
            where: { id },
            data: {
                ...(body.number && { number: parseInt(body.number) }),
                ...(body.title && { title: body.title }),
                ...(body.lyrics && { lyrics: body.lyrics }),
                ...(body.author !== undefined && { author: body.author }),
                ...(body.tags !== undefined && { tags: body.tags }),
                ...(body.tuneUrl !== undefined && { tuneUrl: body.tuneUrl }),
            },
        });
        return NextResponse.json(hymn);
    } catch {
        return NextResponse.json({ error: "Failed to update hymn." }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.hymn.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete hymn." }, { status: 500 });
    }
}
