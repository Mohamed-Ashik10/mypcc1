import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DiaryEntrySchema } from "@/lib/validators";

// GET all diary entries (paginated)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
        prisma.diaryEntry.findMany({
            skip,
            take: limit,
            orderBy: { date: "asc" },
        }),
        prisma.diaryEntry.count(),
    ]);

    return NextResponse.json({ entries, total, page, limit }, {
        headers: {
            "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
    });
}

// POST create a new diary entry
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const parsed = DiaryEntrySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { date, title, readingOne, readingTwo, readingThree, theme, body: entryBody, hymn, userId } = parsed.data;
        const currentUserId = (session.user as any).id;
        const role = (session?.user as any)?.role;

        // 🛡️ Subscription Limit Logic for PERSONAL entries
        if (userId) {
            // 1. Ensure user is creating for themselves
            if (userId !== currentUserId)
                return NextResponse.json({ error: "Forbidden: You can only create entries for yourself." }, { status: 403 });

            // 2. Determine Plan & Limit
            const activeSub = await prisma.subscription.findFirst({
                where: { userId: currentUserId, status: "ACTIVE" }
            });

            let limit = 5; // Default Free limit
            let planName = "Free";

            if (activeSub) {
                switch (activeSub.type) {
                    case "SEEKER": limit = 20; planName = "Seeker"; break;
                    case "PILGRIM": limit = 100; planName = "Pilgrim"; break;
                    case "SHEPHERD": limit = 10000; planName = "Shepherd"; break;
                }
            }

            // 3. Check current count
            const currentCount = await prisma.diaryEntry.count({ where: { userId: currentUserId } });

            if (currentCount >= limit) {
                return NextResponse.json({ 
                    error: `Limit reached! Your current ${planName} plan only allows up to ${limit === 10000 ? 'unlimited' : limit} entries.`,
                    code: "LIMIT_REACHED",
                    limit,
                    currentCount
                }, { status: 403 });
            }
        } else {
            // Official Church Diary entry (requires Admin)
            if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
                return NextResponse.json({ error: "Forbidden: Only admins can create official entries." }, { status: 403 });
        }

        const entry = await prisma.diaryEntry.create({
            data: {
                date: new Date(date),
                title,
                readingOne,
                readingTwo,
                readingThree,
                theme,
                body: entryBody,
                hymn,
                userId: userId || null,
            },
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            // Note: Since we removed @unique on date, this might not trigger unless we have a composite unique
            return NextResponse.json({ error: "A diary entry with this constraint already exists." }, { status: 409 });
        }
        console.error("Diary POST error:", error);
        return NextResponse.json({ error: "Failed to create diary entry." }, { status: 500 });
    }
}
