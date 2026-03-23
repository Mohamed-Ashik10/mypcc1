import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

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
        const { title, date, content, author, image, category, reading, excerpt, isFree, minPlan } = body;

        if (!title || !date || !content) {
            return NextResponse.json({ error: "Title, date, and content are required." }, { status: 400 });
        }

        const devotional = await prisma.devotional.create({
            data: {
                title,
                date: new Date(date),
                content,
                author: author || null,
                image: image || null,
                category: category || "Inspiration",
                reading: reading || null,
                excerpt: excerpt || null,
                isFree: isFree !== false,
                minPlan: (minPlan as any) || "SEEKER",
            },
        });

        return NextResponse.json(devotional, { status: 201 });
    } catch (error) {
        console.error("Error creating devotional:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
