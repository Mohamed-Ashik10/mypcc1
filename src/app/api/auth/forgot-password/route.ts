import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // For security, even if user doesn't exist, we can return success
        // but for this demo/local env, let's just log it
        console.log(`[SIMULATION] Verification code sent to: ${email}`);

        // In a real app, you would generate a code, save it in DB with expiry, and email it.

        return NextResponse.json(
            { message: "A password reset link has been sent to your email address" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "An error occurred" },
            { status: 500 }
        );
    }
}
