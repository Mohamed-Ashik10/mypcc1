import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- GET: Fetch All PCC Info Sections --
export async function GET(req: NextRequest) {
    try {
        const sections = await prisma.pccInfo.findMany({
            orderBy: { section: 'asc' }
        });
        return NextResponse.json(sections);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- POST: Create/Update Section --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const section = await prisma.pccInfo.upsert({
            where: { section: body.section },
            update: { content: body.content },
            create: {
                section: body.section,
                content: body.content
            }
        });
        return NextResponse.json(section);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
