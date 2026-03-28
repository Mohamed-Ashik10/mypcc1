import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- GET: Fetch All Subscriptions (Admin) or User Subscriptions --
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    const userId = (session?.user as any)?.id;

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    try {
        if (targetUserId) {
            // Fetch for specific user
            const subs = await prisma.subscription.findMany({
                where: { userId: targetUserId },
                orderBy: { endDate: 'desc' }
            });
            return NextResponse.json(subs);
        } else {
            // Admin: Fetch All
            if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const allSubs = await prisma.subscription.findMany({
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(allSubs);
        }
    } catch (err: any) {
        console.error("Subscription GET error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- POST: Create/Update Subscription --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const sub = await prisma.subscription.create({
            data: {
                userId: body.userId,
                type: body.type, // SEEKER, PILGRIM, SHEPHERD
                status: body.status || "ACTIVE",
                startDate: new Date(),
                endDate: new Date(body.endDate),
                billingCycle: body.billingCycle || "MONTHLY"
            }
        });
        return NextResponse.json(sub);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
