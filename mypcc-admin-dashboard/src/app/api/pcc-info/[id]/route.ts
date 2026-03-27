import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { section, content } = await req.json();
        const updated = await prisma.pccInfo.update({
            where: { id: params.id },
            data: { section, content }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update pcc info" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.pccInfo.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete pcc info" }, { status: 500 });
    }
}
