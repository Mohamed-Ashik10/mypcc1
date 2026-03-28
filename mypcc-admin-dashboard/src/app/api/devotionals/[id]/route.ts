import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["ADMIN_STAFF", "CONTENT_EDITOR", "SUPER_ADMIN", "ADMIN"].includes(userRole.toUpperCase())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        
        if (body.date) {
            body.date = new Date(body.date).toISOString();
        }

        try {
            const updated = await fetchFromBackend<any>(`/api/admin/content/devotionals/${id}`, {
                method: "PATCH",
                body: JSON.stringify(body),
            });
            return NextResponse.json(updated);
        } catch (backendErr) {
            console.error("Backend PATCH failed. Shifting to Direct Cloud Sync.", backendErr);
            const saved = await prisma.devotional.update({
                where: { id: id },
                data: {
                    title: body.title,
                    date: body.date ? new Date(body.date) : undefined,
                    author: body.author,
                    content: body.content,
                    image: body.image,
                    category: body.category,
                    reading: body.reading,
                    excerpt: body.excerpt,
                    isFree: body.isFree,
                    minPlan: body.minPlan
                }
            });
            return NextResponse.json(saved);
        }
    } catch (error: any) {
        console.error("Error updating devotional:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["ADMIN_STAFF", "CONTENT_EDITOR", "SUPER_ADMIN", "ADMIN"].includes(userRole.toUpperCase())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;
        try {
            await fetchFromBackend<any>(`/api/admin/content/devotionals/${id}`, {
                method: "DELETE",
            });
            return NextResponse.json({ message: "Devotional deleted successfully" });
        } catch (backendErr) {
            console.error("Backend DELETE failed. Shifting to Direct Cloud Sync.", backendErr);
            await prisma.devotional.delete({ where: { id: id } });
            return NextResponse.json({ message: "Devotional deleted successfully" });
        }
    } catch (error: any) {
        console.error("Error deleting devotional:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
