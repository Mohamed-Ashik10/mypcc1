import prisma from "@/lib/prisma";
import { fetchFromBackend } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const issue = await prisma.theEchoIssue.findUnique({
            where: { id }
        });
        
        if (!issue) {
            return NextResponse.json({ error: "Newsletter Not Found" }, { status: 404 });
        }

        return NextResponse.json(issue);
    } catch (error) {
        console.error("Echo GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await request.json();
    try {
        if (body.issueMonth) {
            body.issueMonth = new Date(body.issueMonth).toISOString();
        }

        const issue = await fetchFromBackend<any>(`/api/admin/content/echo/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
        return NextResponse.json(issue);
    } catch (error) {
        console.error("Echo PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update issue in backend." }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    if (!["SUPER_ADMIN", "ADMIN_STAFF", "CONTENT_EDITOR"].includes(role))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    try {
        await fetchFromBackend<any>(`/api/admin/content/echo/${id}`, {
            method: "DELETE",
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete issue in backend." }, { status: 500 });
    }
}
