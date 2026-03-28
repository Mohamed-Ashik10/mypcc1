import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- POST: Create Diary Entry --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const entry = await prisma.diaryEntry.create({
            data: {
                date: new Date(body.date),
                title: body.title || "",
                theme: body.theme || "",
                readingOne: body.readingOne || "",
                readingTwo: body.readingTwo || "",
                readingThree: body.readingThree || "",
                body: body.body || "",
                hymn: body.hymn || "",
                userId: null // Admin entries are for general logs
            }
        });
        return NextResponse.json(entry);
    } catch (err: any) {
        console.error("Diary POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
