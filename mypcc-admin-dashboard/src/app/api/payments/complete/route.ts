import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchFromBackend } from "@/lib/api";
import prisma from "@/lib/prisma";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { planType, amount, paymentMethod } = body;
        const userId = (session.user as any).id;

        if (!userId || !planType || !amount || !paymentMethod) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        try {
            // Attempt backend first
            const result = await fetchFromBackend<any>("/api/public/user-activity/payments/complete", {
                method: "POST",
                body: JSON.stringify({ userId, planType, amount, paymentMethod })
            });
            return NextResponse.json({ success: true, data: result });
        } catch (backendErr) {
            console.error("Backend Payment Sync failed. Shifting to Direct Cloud Sync.", backendErr);
            
            // 1. Create Transaction record
            const reference = `TX-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now()}`;
            const tx = await prisma.transaction.create({
                data: {
                    userId,
                    amount: parseFloat(amount),
                    currency: "XAF",
                    paymentMethod,
                    status: "COMPLETED",
                    reference
                }
            });

            // 2. Update/Create Subscription
            const durationDays = 30; // Monthly constant
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + durationDays);

            const sub = await prisma.subscription.upsert({
                where: { id: `SUB-${userId}` }, // Simplified mapping for fallback
                update: {
                    type: planType,
                    status: "ACTIVE",
                    endDate,
                    updatedAt: new Date()
                },
                create: {
                    id: `SUB-${userId}`,
                    userId,
                    type: planType,
                    status: "ACTIVE",
                    endDate,
                    billingCycle: "MONTHLY"
                }
            });

            return NextResponse.json({ success: true, data: { tx, sub, mode: "cloud-direct" } });
        }
    } catch (error: any) {
        console.error("Critical Payment API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
