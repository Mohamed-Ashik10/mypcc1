import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await req.json();

        const feedback = await (prisma as any).supportRequest.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, feedback });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
