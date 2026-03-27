import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
    console.log("*****************************************");
    console.log("!!! FORGOT PASSWORD API TRIGGERED !!!");
    console.log("Time:", new Date().toISOString());
    console.log("*****************************************");
    try {
        const body = await req.json();
        const { email } = body;
        console.log("Searching for email:", email);

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

        if (user) {
            // Generate a secure random token
            const token = crypto.randomBytes(32).toString("hex");
            const expiry = new Date(Date.now() + 3600000); // 1 hour from now

            // Save token and expiry to user
            await prisma.user.update({
                where: { email },
                data: {
                    resetToken: token,
                    resetTokenExpiry: expiry,
                },
            });

            // Send actual email (swallow errors to prevent info leakage, but log locally)
            try {
                await sendResetPasswordEmail(email, token);
                console.log(`[SUCCESS] Reset email sent to: ${email}`);
            } catch (emailError) {
                console.error("Email sending failed:", emailError);
            }
        } else {
            console.log(`[SECURITY] Forgot password attempt for non-existent email: ${email}`);
        }

        // For security, always return success even if user doesn't exist
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
