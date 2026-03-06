import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { DevotionalSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const skip = (page - 1) * limit;

    const [devotionals, total] = await Promise.all([
        prisma.devotional.findMany({
            skip,
            take: limit,
            orderBy: { date: "desc" },
        }),
        prisma.devotional.count(),
    ]);

    return NextResponse.json({ devotionals, total, page, limit }, {
        headers: {
            // Devotionals change once per day — cache for 1 hour
            "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200",
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role || "NORMAL_USER";
        if (!["ADMIN_STAFF", "CONTENT_EDITOR", "SUPER_ADMIN"].includes(userRole.toUpperCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const parsed = DevotionalSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { title, date, content, author } = parsed.data;
        const devotional = await prisma.devotional.create({
            data: { title, date: new Date(date), content, author },
        });

        return NextResponse.json(devotional, { status: 201 });
    } catch (error) {
        console.error("Error creating devotional:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
