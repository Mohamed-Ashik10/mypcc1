import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads");
        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {}

        const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_").toLowerCase()}`;
        const path = join(uploadDir, filename);
        
        await writeFile(path, buffer);
        
        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
    }
}
