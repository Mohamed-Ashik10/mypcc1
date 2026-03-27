import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchFromBackend } from "@/lib/api";

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
        const result = await fetchFromBackend<any>("/api/public/user-activity/payments/complete", {
            method: "POST",
            body: JSON.stringify({ userId, planType, amount, paymentMethod })
        });
        
        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("Payment API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error during backend transaction" }, { status: 500 });
    }
}
