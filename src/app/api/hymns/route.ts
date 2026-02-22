import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "30");
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

    return NextResponse.json({ hymns, total, page, limit });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { number, title, lyrics } = body;

        if (!number || !title || !lyrics) {
            return NextResponse.json({ error: "Number, title and lyrics are required." }, { status: 400 });
        }

        const hymn = await prisma.hymn.create({
            data: { number: parseInt(number), title, lyrics },
        });
        return NextResponse.json(hymn, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "A hymn with this number already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create hymn." }, { status: 500 });
    }
}
