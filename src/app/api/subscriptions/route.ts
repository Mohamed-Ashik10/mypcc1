import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/subscriptions — get authenticated user's active subscription
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId,
                status: "ACTIVE",
                endDate: { gte: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            hasActiveSubscription: !!subscription,
            subscription: subscription ?? null,
        });
    } catch (error) {
        console.error("Subscription GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
