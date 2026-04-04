import { fetchFromBackend } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    try {
        const data = await fetchFromBackend<any>(`/api/admin/content/echo?${searchParams.toString()}`);
        return NextResponse.json(data.issues || data);
    } catch (error) {
        console.warn("Backend echo fetch failed, using Prisma fallback");
        const issues = await prisma.theEchoIssue.findMany({
            orderBy: { issueMonth: 'desc' }
        });
        return NextResponse.json(issues);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Ensure date is ISO string for Spring Boot
        if (body.issueMonth) {
            body.issueMonth = new Date(body.issueMonth).toISOString();
        }

        try {
            const issue = await fetchFromBackend<any>("/api/admin/content/echo", {
                method: "POST",
                body: JSON.stringify(body),
            });
            return NextResponse.json(issue, { status: 201 });
        } catch (backendError) {
            console.warn("Backend echo creation failed, using Prisma direct creation");
            const issue = await prisma.theEchoIssue.create({
                data: {
                    ...body,
                    issueMonth: new Date(body.issueMonth)
                }
            });
            return NextResponse.json(issue, { status: 201 });
        }
    } catch (error) {
        console.error("Create Echo Error:", error);
        return NextResponse.json({ error: "Failed to create issue. Database error." }, { status: 500 });
    }
}
