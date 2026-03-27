import { fetchFromBackend } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    try {
        const data = await fetchFromBackend<any>(`/api/admin/content/echo?${searchParams.toString()}`);
        return NextResponse.json(data.issues || data);
    } catch (error) {
        return NextResponse.json({ error: "Backend communication failed" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Ensure date is ISO string for Spring Boot
        if (body.issueMonth) {
            body.issueMonth = new Date(body.issueMonth).toISOString();
        }

        const issue = await fetchFromBackend<any>("/api/admin/content/echo", {
            method: "POST",
            body: JSON.stringify(body),
        });

        return NextResponse.json(issue, { status: 201 });
    } catch (error) {
        console.error("Create Echo Error:", error);
        return NextResponse.json({ error: "Failed to create issue in backend." }, { status: 500 });
    }
}
