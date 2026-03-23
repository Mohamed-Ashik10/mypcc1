import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HymnSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "30"), 100); // cap at 100
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") ?? "";

    const where = search
        ? {
            OR: [
                { title: { contains: search } },
                { number: { equals: parseInt(search) || undefined } },
            ],
        }
        : {};

    const [hymns, total] = await Promise.all([
        prisma.hymn.findMany({ where, skip, take: limit, orderBy: { number: "asc" } }),
        prisma.hymn.count({ where }),
    ]);

    return NextResponse.json({ hymns, total, page, limit }, {
        headers: {
            // Cache at CDN edge for 5 mins, serve stale for up to 10 mins while revalidating
            "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
    });
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await request.json();
        const parsed = HymnSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { number, title, lyrics, author, tags, tuneUrl } = parsed.data;
        const hymn = await prisma.hymn.create({
            data: { number, title, lyrics, author, tags, tuneUrl },
        });
        return NextResponse.json(hymn, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "A hymn with this number already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create hymn." }, { status: 500 });
    }
}
