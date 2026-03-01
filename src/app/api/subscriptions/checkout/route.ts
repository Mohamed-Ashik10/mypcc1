import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// Plan pricing in XAF (CFA Francs)
const PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
    SEEKER: { monthly: 0, annual: 0 },
    PILGRIM: { monthly: 4200, annual: 3000 },   // ~$7/mo or ~$5/mo annually
    SHEPHERD: { monthly: 10800, annual: 7200 },    // ~$18/mo or ~$12/mo annually
};

// POST /api/subscriptions/checkout
// Body: { planType: "SEEKER"|"PILGRIM"|"SHEPHERD", billingCycle: "MONTHLY"|"ANNUAL", paymentMethod: "MOBILE_MONEY"|"VISA"|"PAYPAL" }
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { planType, billingCycle, paymentMethod } = await request.json();

    if (!planType || !billingCycle) {
        return NextResponse.json({ error: "planType and billingCycle are required" }, { status: 400 });
    }

    const pricing = PLAN_PRICES[planType];
    if (!pricing) {
        return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    const amount = billingCycle === "ANNUAL" ? pricing.annual : pricing.monthly;

    try {
        const reference = `CAN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

        // Calculate subscription end date
        const startDate = new Date();
        const endDate = new Date();
        if (billingCycle === "ANNUAL") {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        const result = await prisma.$transaction(async (tx) => {
            // Record the transaction (free plans have amount=0)
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    currency: "XAF",
                    paymentMethod: paymentMethod ?? "MOBILE_MONEY",
                    status: "COMPLETED",
                    reference,
                },
            });

            // Expire any existing active subscriptions
            await tx.subscription.updateMany({
                where: { userId, status: "ACTIVE" },
                data: { status: "EXPIRED" },
            });

            // Create the new subscription
            const subscription = await tx.subscription.create({
                data: {
                    userId,
                    type: planType,
                    billingCycle,
                    status: "ACTIVE",
                    startDate,
                    endDate,
                },
            });

            return { transaction, subscription };
        });

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
