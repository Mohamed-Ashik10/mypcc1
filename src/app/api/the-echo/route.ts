import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const issues = await prisma.theEchoIssue.findMany({ orderBy: { issueMonth: "desc" } });
    return NextResponse.json(issues);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, issueMonth, pdfUrl, coverUrl, images, isFree, isFeatured, excerpt, fullText, category } = body;

        if (!title || !issueMonth) {
            return NextResponse.json({ error: "Title and month are required." }, { status: 400 });
        }

        // If this issue is being marked as featured, unfeature all others
        if (isFeatured) {
            await prisma.theEchoIssue.updateMany({
                where: { isFeatured: true },
                data: { isFeatured: false }
            });
        }

        const issue = await (prisma as any).theEchoIssue.create({
            data: {
                title,
                issueMonth: new Date(issueMonth),
                pdfUrl: pdfUrl || "#",
                coverUrl: coverUrl || null,
                images: images || [],
                isFree: isFree ?? true,
                isFeatured: isFeatured ?? false,
                excerpt: excerpt || null,
                fullText: fullText || null,
                category: category || "news",
            },
        });

        // Improvement #3: Automatically notify High Premium (SHEPHERD) subscribers
        const premiumSubscribers = await prisma.subscription.findMany({
            where: {
                type: "SHEPHERD",
                status: "ACTIVE"
            },
            include: {
                user: { select: { email: true } }
            }
        });

        const subscriberCount = premiumSubscribers.length;
        if (subscriberCount > 0) {
            const emails = premiumSubscribers.map(s => s.user.email).filter(Boolean);
            console.log(`[AUTOMATION] Automatically notifying ${subscriberCount} High-Premium (SHEPHERD) subscribers for: ${title}`);
            console.log(`[RECIPIENTS]: ${emails.join(", ")}`);
        }

        return NextResponse.json({ ...issue, notifiedCount: subscriberCount }, { status: 201 });
    } catch (error) {
        console.error("Create Echo Error:", error);
        return NextResponse.json({ error: "Failed to create issue." }, { status: 500 });
    }
}
