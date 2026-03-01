import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, email, password, role } = await req.json();
        const { id: userId } = await params;

        const updateData: any = {
            name,
            email,
            role,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id: userId } = await params;

        // Prevent Super Admin from deleting themselves if needed
        if ((session.user as any).id === userId) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 });
    }
}
