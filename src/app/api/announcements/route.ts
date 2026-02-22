import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(announcements);
}

export async function POST(request: NextRequest) {
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
