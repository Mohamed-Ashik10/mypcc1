import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all diary entries (paginated)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
        prisma.diaryEntry.findMany({
            skip,
            take: limit,
            orderBy: { date: "asc" },
        }),
        prisma.diaryEntry.count(),
    ]);

    return NextResponse.json({ entries, total, page, limit });
}

// POST create a new diary entry (ADMIN / STAFF only)
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    try {
        const body = await request.json();
        const { date, title, readingOne, readingTwo, readingThree, theme } = body;

        if (!date || !readingOne) {
            return NextResponse.json({ error: "Date and Reading One are required." }, { status: 400 });
        }

        const entry = await prisma.diaryEntry.create({
            data: {
                date: new Date(date),
                title,
                readingOne,
                readingTwo,
                readingThree,
                theme,
            },
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "A diary entry for this date already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create diary entry." }, { status: 500 });
    }
}
