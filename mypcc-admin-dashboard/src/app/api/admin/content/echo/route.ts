import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- POST: Create Echo Issue --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const issue = await prisma.theEchoIssue.create({
            data: {
                title: body.title,
                issueMonth: new Date(body.issueMonth),
                pdfUrl: body.pdfUrl,
                coverUrl: body.coverUrl || "",
                isFree: body.isFree ?? true,
                isFeatured: body.isFeatured ?? false,
                excerpt: body.excerpt || "",
                fullText: body.fullText || "",
                minPlan: body.minPlan || "SEEKER",
                author: "Admin",
                category: "news"
            }
        });
        return NextResponse.json(issue);
    } catch (err: any) {
        console.error("Echo POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
