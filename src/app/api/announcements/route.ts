import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(announcements);
}

// POST create announcement (ADMIN / STAFF only)
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await request.json();
        const { title, content, isActive } = body;
        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
        }
        const announcement = await prisma.announcement.create({
            data: { title, content, isActive: isActive ?? true },
        });
        return NextResponse.json(announcement, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create announcement." }, { status: 500 });
    }
}
