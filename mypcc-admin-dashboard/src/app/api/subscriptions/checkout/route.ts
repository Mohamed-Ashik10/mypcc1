import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { planType, paymentMethod, phoneNumber } = await req.json();
        const userId = (session.user as any).id;

        if (!["SEEKER", "PILGRIM", "SHEPHERD"].includes(planType)) {
            return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
        }

        // Simulate a payment gateway delay (e.g., 2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create the end date (1 month from now)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        // We use a transaction to ensure both subscription and history are updated
        const result = await prisma.$transaction(async (tx) => {
            // 1. Deactivate any existing active subscriptions for this user
            await tx.subscription.updateMany({
                where: { userId, status: "ACTIVE" },
                data: { status: "EXPIRED" } // Or CANCELLED
            });

            // 2. Create the new subscription
            const sub = await tx.subscription.create({
                data: {
                    userId,
                    type: planType,
                    status: "ACTIVE",
                    startDate,
                    endDate,
                    billingCycle: "MONTHLY"
                }
            });

            // 3. Record the transaction
            const prices: Record<string, number> = { SEEKER: 1500, PILGRIM: 4500, SHEPHERD: 12000 };
            await tx.transaction.create({
                data: {
                    userId,
                    amount: prices[planType] || 0,
                    currency: "XAF",
                    paymentMethod: paymentMethod === "CARD" ? "VISA" : "MOBILE_MONEY",
                    status: "COMPLETED",
                    reference: `CAN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`
                }
            });

            return sub;
        });

        return NextResponse.json({ success: true, subscription: result });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
    }
}
