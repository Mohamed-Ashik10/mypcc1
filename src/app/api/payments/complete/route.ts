import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planType, amount, paymentMethod } = await request.json();
    const userId = (session.user as any).id;

    if (!userId || !planType || !amount || !paymentMethod) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // 1. Calculate transaction reference
        const reference = `PCC-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

        // 2. Determine subscription duration
        const startDate = new Date();
        const endDate = new Date();
        if (planType === "MONTHLY") endDate.setDate(endDate.getDate() + 30);
        else if (planType === "QUARTERLY") endDate.setDate(endDate.getDate() + 90);
        else if (planType === "YEARLY") endDate.setDate(endDate.getDate() + 365);

        // 3. Start a transaction to ensure both records are created
        const result = await prisma.$transaction(async (tx) => {
            // Create the Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amount: parseFloat(amount),
                    currency: "XAF",
                    paymentMethod,
                    status: "COMPLETED",
                    reference,
                }
            });

            // Deactivate any existing active subscriptions first (optional but cleaner)
            await tx.subscription.updateMany({
                where: { userId, status: "ACTIVE" },
                data: { status: "EXPIRED" } // Simple migration: expire old ones
            });

            // Create the new Subscription
            const subscription = await tx.subscription.create({
                data: {
                    userId,
                    type: planType,
                    status: "ACTIVE",
                    startDate,
                    endDate,
                }
            });

            return { transaction, subscription };
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
