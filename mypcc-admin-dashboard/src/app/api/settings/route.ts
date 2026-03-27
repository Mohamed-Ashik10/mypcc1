import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

// GET — return all settings as { key: value } map
export async function GET() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF"].includes(role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await prisma.appSetting.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;
    return NextResponse.json(settings);
}

// POST — upsert multiple settings at once
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF"].includes(role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body: Record<string, string> = await request.json();
    const upserts = Object.entries(body).map(([key, value]) =>
        prisma.appSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        })
    );
    await Promise.all(upserts);
    return NextResponse.json({ success: true });
}

// POST to /api/settings/test-email — send a test email using saved SMTP settings
export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !["SUPER_ADMIN", "ADMIN_STAFF"].includes(role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { toEmail } = await request.json();

    // Load SMTP settings from DB (fall back to env)
    const rows = await prisma.appSetting.findMany({
        where: { key: { in: ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_name", "smtp_from_email"] } }
    });
    const s: Record<string, string> = {};
    for (const r of rows) s[r.key] = r.value;

    const host = s.smtp_host || process.env.EMAIL_SERVER_HOST || "";
    const port = parseInt(s.smtp_port || process.env.EMAIL_SERVER_PORT || "587");
    const user = s.smtp_user || process.env.EMAIL_SERVER_USER || "";
    const pass = s.smtp_pass || process.env.EMAIL_SERVER_PASSWORD || "";
    const fromName = s.smtp_from_name || process.env.EMAIL_FROM_NAME || "Canticle";
    const fromEmail = s.smtp_from_email || process.env.EMAIL_FROM || user;

    if (!host || !user || !pass) {
        return NextResponse.json({ error: "SMTP settings not configured" }, { status: 400 });
    }

    try {
        const transporter = nodemailer.createTransport({
            host, port, secure: port === 465,
            auth: { user, pass },
        });
        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: toEmail,
            subject: "✅ Canticle – Test Email",
            html: `<div style="font-family:sans-serif;padding:32px;max-width:480px">
                <h2 style="color:#6e1799">Test Email Successful</h2>
                <p>Your SMTP settings are working correctly. Emails will be sent from <strong>${fromEmail}</strong>.</p>
                <p style="color:#999;font-size:12px">Sent from Canticle Admin Settings</p>
            </div>`,
        });
        return NextResponse.json({ success: true, message: `Test email sent to ${toEmail}` });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to send test email" }, { status: 500 });
    }
}
