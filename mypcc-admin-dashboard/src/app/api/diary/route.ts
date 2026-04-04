import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DiaryEntrySchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all diary entries (paginated)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    try {
        const data = await fetchFromBackend<any>(`/api/admin/diary?${searchParams.toString()}`);
        return NextResponse.json(data);
    } catch (error) {
        console.warn("Backend diary fetch failed, using Prisma fallback");
        const entries = await prisma.diaryEntry.findMany({
            orderBy: { date: 'desc' },
            take: 50 // Limit for safety
        });
        return NextResponse.json(entries);
    }
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

        const role = (session?.user as any)?.role;
        const currentUserId = (session.user as any).id;
        const { userId } = parsed.data;

        // Implementation with Backend first, Prisma fallback
        const tryCreate = async (data: any, isOfficial: boolean) => {
            const endpoint = isOfficial ? "/api/admin/diary" : "/api/public/user-activity/diary";
            try {
                return await fetchFromBackend<any>(endpoint, {
                    method: "POST",
                    body: JSON.stringify(data),
                });
            } catch (err) {
                console.warn(`Backend POST to ${endpoint} failed, falling back to Prisma direct creation`);
                return await prisma.diaryEntry.create({
                   data: {
                       ...data,
                       date: new Date(data.date),
                       userId: data.userId || null
                   }
                });
            }
        };

        // If it's an official entry (no userId provided by admin)
        if (!userId) {
            if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
                return NextResponse.json({ error: "Forbidden: Only admins can create official entries." }, { status: 403 });

            const preparedData = { ...parsed.data };
            if (preparedData.date) {
                preparedData.date = new Date(preparedData.date).toISOString();
            }

            const entry = await tryCreate(preparedData, true);
            return NextResponse.json(entry, { status: 201 });
        }

        // --- PERSONAL ENTRIES ---
        if (userId !== currentUserId)
            return NextResponse.json({ error: "Forbidden: You can only create entries for yourself." }, { status: 403 });

        const entryBody = {
            ...parsed.data,
            userId: currentUserId,
            date: new Date(parsed.data.date).toISOString()
        };

        const entry = await tryCreate(entryBody, false);
        return NextResponse.json(entry, { status: 201 });
        
    } catch (error: any) {
        console.error("Diary POST error:", error);
        return NextResponse.json({ error: "Failed to create diary entry. Database Error." }, { status: 500 });
    }
}
