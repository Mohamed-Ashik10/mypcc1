import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: "Token and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Find user by token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(), // Token must not be expired
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset tokens
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json(
            { message: "Password has been successfully reset" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Could not reset password at this time" },
            { status: 500 }
        );
    }
}
