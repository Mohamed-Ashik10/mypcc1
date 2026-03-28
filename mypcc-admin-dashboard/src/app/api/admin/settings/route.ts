import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// -- GET: Fetch All App Settings --
export async function GET(req: NextRequest) {
    try {
        const settings = await prisma.appSetting.findMany();
        const settingsMap: Record<string, string> = {};
        settings.forEach(s => settingsMap[s.key] = s.value);
        return NextResponse.json(settingsMap);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// -- POST: Update Settings --
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: Record<string, string> = await req.json();
        const results = [];

        for (const [key, value] of Object.entries(body)) {
            const setting = await prisma.appSetting.upsert({
                where: { key: key },
                update: { value: value },
                create: { key: key, value: value }
            });
            results.push(setting);
        }

        return NextResponse.json({ success: true, count: results.length });
    } catch (err: any) {
        console.error("Settings Update error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
