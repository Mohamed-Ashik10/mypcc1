import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- POST: Create Announcement --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const announcement = await prisma.announcement.create({
            data: {
                title: body.title,
                content: body.content,
                isActive: body.isActive ?? true
            }
        });
        return NextResponse.json(announcement);
    } catch (err: any) {
        console.error("Announcement POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
