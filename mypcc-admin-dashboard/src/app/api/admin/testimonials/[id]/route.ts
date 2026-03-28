import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- PATCH: Update Testimonial --
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await prisma.testimonial.update({
            where: { id: id },
            data: {
                content: body.content,
                authorName: body.authorName,
                authorRole: body.authorRole,
                isActive: body.isActive
            }
        });
        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("Testimonial Update error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- DELETE: Delete Testimonial --
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.testimonial.delete({ where: { id: id } });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Testimonial Delete error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- GET: Get Single Testimonial --
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const testimonial = await prisma.testimonial.findUnique({
            where: { id: id }
        });
        if (!testimonial) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        return NextResponse.json(testimonial);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
