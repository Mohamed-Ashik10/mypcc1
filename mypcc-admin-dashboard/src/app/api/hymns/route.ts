import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HymnSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    try {
        const data = await fetchFromBackend<any>(`/api/admin/content/hymns?${searchParams.toString()}`);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Backend communication failed" }, { status: 500 });
    }
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

        const hymn = await fetchFromBackend<any>("/api/admin/content/hymns", {
            method: "POST",
            body: JSON.stringify(parsed.data),
        });
        return NextResponse.json(hymn, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to create hymn in backend." }, { status: 500 });
    }
}
