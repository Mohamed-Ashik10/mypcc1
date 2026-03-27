import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    try {
        const data = await fetchFromBackend<any>(`/api/admin/content/devotionals?${searchParams.toString()}`);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Backend communication failed" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role || "NORMAL_USER";
        if (!["ADMIN_STAFF", "CONTENT_EDITOR", "SUPER_ADMIN"].includes(userRole.toUpperCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        
        if (body.date) {
            body.date = new Date(body.date).toISOString();
        }

        const devotional = await fetchFromBackend<any>("/api/admin/content/devotionals", {
            method: "POST",
            body: JSON.stringify(body),
        });

        return NextResponse.json(devotional, { status: 201 });
    } catch (error) {
        console.error("Error creating devotional:", error);
        return NextResponse.json({ error: "Internal Server Error in backend" }, { status: 500 });
    }
}
