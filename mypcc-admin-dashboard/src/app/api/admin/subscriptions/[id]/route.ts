import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Protected Admin API to Edit/Delete Subscriptions
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const isAdmin = ["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole);

    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { type, status, endDate } = await req.json();
        const id = params.id;

        const updatedSub = await prisma.subscription.update({
            where: { id },
            data: {
                type: type || undefined,
                status: status || undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            },
        });

        return NextResponse.json({ success: true, subscription: updatedSub });
    } catch (error) {
        console.error("Update Sub Error:", error);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const isAdmin = ["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole);

    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const id = params.id;
        await prisma.subscription.delete({ where: { id } });
        return NextResponse.json({ success: true, message: "Subscription deleted successfully" });
    } catch (error) {
        console.error("Delete Sub Error:", error);
        return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
    }
}
