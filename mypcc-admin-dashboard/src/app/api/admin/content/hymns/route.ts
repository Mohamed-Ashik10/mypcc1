import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- POST: Create New Hymn --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const hymn = await prisma.hymn.create({
            data: {
                number: parseInt(body.number),
                title: body.title,
                lyrics: body.lyrics,
                author: body.author || "",
                tags: body.tags || "",
                tuneUrl: body.tuneUrl || ""
            }
        });
        return NextResponse.json(hymn);
    } catch (err: any) {
        console.error("Create Hymn DB error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
