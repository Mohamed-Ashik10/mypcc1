import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role || "NORMAL_USER";
        if (!["ADMIN_STAFF", "CONTENT_EDITOR", "SUPER_ADMIN"].includes(userRole.toUpperCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const id = (await params).id;
        const body = await request.json();
        
        if (body.date) {
            body.date = new Date(body.date).toISOString();
        }

        const updated = await fetchFromBackend<any>(`/api/admin/content/devotionals/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating devotional:", error);
        return NextResponse.json({ error: "Internal Server Error in backend" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role || "NORMAL_USER";
        if (!["ADMIN_STAFF", "CONTENT_EDITOR", "SUPER_ADMIN"].includes(userRole.toUpperCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const id = (await params).id;
        await fetchFromBackend<any>(`/api/admin/content/devotionals/${id}`, {
            method: "DELETE",
        });

        return NextResponse.json({ message: "Devotional deleted successfully" });
    } catch (error) {
        console.error("Error deleting devotional:", error);
        return NextResponse.json({ error: "Internal Server Error in backend" }, { status: 500 });
    }
}
