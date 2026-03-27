import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const sections = await prisma.pccInfo.findMany({ orderBy: { section: "asc" } });
        return NextResponse.json(sections);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch pcc info" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { section, content } = await req.json();
        const newSection = await prisma.pccInfo.create({
            data: { section, content }
        });
        return NextResponse.json(newSection);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create pcc info" }, { status: 500 });
    }
}
