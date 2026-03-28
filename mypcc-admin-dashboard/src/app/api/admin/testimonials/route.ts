import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- POST: Create Testimonial --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const testimonial = await prisma.testimonial.create({
            data: {
                content: body.content,
                authorName: body.authorName,
                authorRole: body.authorRole || "",
                isActive: body.isActive ?? true
            }
        });
        return NextResponse.json(testimonial);
    } catch (err: any) {
        console.error("Testimonial POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
