import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnnouncementSchema } from "@/lib/validators";

export async function GET() {
    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(announcements, {
        headers: {
            // Announcements update often — cache for 10 minutes
            "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
        },
    });
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
        const parsed = AnnouncementSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, content, isActive } = parsed.data;
        const announcement = await prisma.announcement.create({
            data: { title, content, isActive },
        });
        return NextResponse.json(announcement, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create announcement." }, { status: 500 });
    }
}
