import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role || "USER";
        if (!["ADMIN", "STAFF", "EDITOR", "SUPER_ADMIN"].includes(userRole.toUpperCase())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, date, content, author } = body;

        const devotional = await prisma.devotional.create({
            data: {
                title,
                date: new Date(date),
                content,
                author,
            },
        });

        return NextResponse.json(devotional, { status: 201 });
    } catch (error) {
        console.error("Error creating devotional:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
