import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const issues = await prisma.theEchoIssue.findMany({ orderBy: { issueMonth: "desc" } });
    return NextResponse.json(issues);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, issueMonth, pdfUrl, coverUrl, isFree } = body;

        if (!title || !issueMonth || !pdfUrl) {
            return NextResponse.json({ error: "Title, month, and PDF URL are required." }, { status: 400 });
        }

        const issue = await prisma.theEchoIssue.create({
            data: {
                title,
                issueMonth: new Date(issueMonth),
                pdfUrl,
                coverUrl: coverUrl || null,
                isFree: isFree ?? true,
            },
        });
        return NextResponse.json(issue, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create issue." }, { status: 500 });
    }
}
