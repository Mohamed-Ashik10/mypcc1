import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { message, subject, name, email } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Get user details from session if available
        const userId = session?.user?.id;
        const userEmail = email || session?.user?.email;
        const userName = name || session?.user?.name;

        // Determine priority based on user subscription (if logged in)
        let isPriority = false;
        if (userId) {
            const subscription = await prisma.subscription.findFirst({
                where: { userId, status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' }
            });
            if (subscription?.type === 'SHEPHERD') {
                isPriority = true;
            }
        }

        const feedback = await prisma.supportRequest.create({
            data: {
                userId: userId || null,
                name: userName || "Anonymous",
                email: userEmail || "No Email",
                subject: subject || (isPriority ? "✨ Priority Support Request" : "General Support"),
                message: message,
                isPriority: isPriority,
                status: 'OPEN'
            }
        });

        return NextResponse.json({ success: true, feedback });
    } catch (error: any) {
        console.error("Feedback Submission Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
