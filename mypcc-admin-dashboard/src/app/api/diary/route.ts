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
        return NextResponse.json({ error: "Backend communication failed" }, { status: 500 });
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

        // If it's an official entry (no userId provided by admin)
        if (!userId) {
            if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
                return NextResponse.json({ error: "Forbidden: Only admins can create official entries." }, { status: 403 });

            if (parsed.data.date) {
                parsed.data.date = new Date(parsed.data.date).toISOString();
            }

            const entry = await fetchFromBackend<any>("/api/admin/diary", {
                method: "POST",
                body: JSON.stringify(parsed.data),
            });
            return NextResponse.json(entry, { status: 201 });
        }

        // --- PERSONAL ENTRIES (MOVED TO SPRING BOOT) ---
        if (userId !== currentUserId)
            return NextResponse.json({ error: "Forbidden: You can only create entries for yourself." }, { status: 403 });

        const entryBody = {
            ...parsed.data,
            userId: currentUserId,
            // Ensure date is formatted for Java LocalDateTime
            date: new Date(parsed.data.date).toISOString()
        };

        const entry = await fetchFromBackend<any>("/api/public/user-activity/diary", {
            method: "POST",
            body: JSON.stringify(entryBody),
        });
        
        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        console.error("Diary POST error:", error);
        // Handle the backend's LIMIT_REACHED error specifically if it happens
        if (error.message.includes("LIMIT_REACHED")) {
            try {
                // Try to parse the error json if it was returned as string
                const errData = JSON.parse(error.message.split("): ")[1]);
                return NextResponse.json(errData, { status: 403 });
            } catch {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
        }
        return NextResponse.json({ error: "Failed to create diary entry." }, { status: 500 });
    }
}
