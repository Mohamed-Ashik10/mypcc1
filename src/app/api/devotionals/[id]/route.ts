import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role || "USER";
        if (!["ADMIN", "STAFF", "EDITOR", "SUPER_ADMIN"].includes(userRole.toUpperCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const id = (await params).id;

        await prisma.devotional.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Devotional deleted successfully" });
    } catch (error) {
        console.error("Error deleting devotional:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
