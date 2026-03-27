import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const hymn = await fetchFromBackend<any>(`/api/admin/content/hymns/${id}`);
        if (!hymn) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(hymn);
    } catch (error) {
        return NextResponse.json({ error: "Backend communication failed" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const updated = await fetchFromBackend<any>(`/api/admin/content/hymns/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update hymn in backend." }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await fetchFromBackend<any>(`/api/admin/content/hymns/${id}`, {
            method: "DELETE",
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete hymn in backend." }, { status: 500 });
    }
}
