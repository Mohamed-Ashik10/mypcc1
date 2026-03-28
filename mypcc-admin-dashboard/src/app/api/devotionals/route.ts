import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    try {
        const data = await fetchFromBackend<any>(`/api/admin/content/devotionals?${searchParams.toString()}`);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Backend fetch failed. Using Prisma Fallback for Devotionals.", error);
        try {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const devotionals = await prisma.devotional.findMany({
                orderBy: { date: 'desc' },
                skip: skip,
                take: parseInt(limit)
            });
            const total = await prisma.devotional.count();
            return NextResponse.json({
                devotionals,
                totalElements: total,
                totalPages: Math.ceil(total / parseInt(limit)),
                currentPage: parseInt(page)
            });
        } catch (dbError) {
            return NextResponse.json({ error: "Cloud database fetch failed" }, { status: 500 });
        }
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["ADMIN_STAFF", "CONTENT_EDITOR", "SUPER_ADMIN", "ADMIN"].includes(userRole.toUpperCase())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const dateStr = body.date ? new Date(body.date).toISOString() : new Date().toISOString();

        try {
            // Attempt backend first
            const devotional = await fetchFromBackend<any>("/api/admin/content/devotionals", {
                method: "POST",
                body: JSON.stringify({ ...body, date: dateStr }),
            });
            return NextResponse.json(devotional, { status: 201 });
        } catch (backendErr) {
            console.error("Backend POST failed. Shifting to Direct Cloud Sync.", backendErr);
            const saved = await prisma.devotional.create({
                data: {
                    title: body.title,
                    date: new Date(dateStr),
                    author: body.author || "PCC Editorial",
                    content: body.content,
                    image: body.image || "",
                    category: body.category || "Inspiration",
                    reading: body.reading || "",
                    excerpt: body.excerpt || "",
                    isFree: body.isFree ?? true,
                    minPlan: body.minPlan || "SEEKER"
                }
            });
            return NextResponse.json(saved, { status: 201 });
        }
    } catch (error: any) {
        console.error("Error creating devotional:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
