import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions).catch(() => null);
    const userRole = (session?.user as any)?.role || "NORMAL_USER";
    if (!["SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { toEmail } = body;

        if (!toEmail) {
            return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
        }

        // Get settings from DB directly
        const rows = await prisma.appSetting.findMany({
            where: {
                key: {
                    in: ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_name", "smtp_from_email"],
                },
            },
        });
        
        const s: Record<string, string> = {};
        for (const r of rows) s[r.key] = r.value;

        const host = s.smtp_host || process.env.SMTP_HOST || "smtp.gmail.com";
        const port = parseInt(s.smtp_port || process.env.SMTP_PORT || "587");
        const user = s.smtp_user || process.env.SMTP_USER || "";
        const pass = s.smtp_pass || process.env.SMTP_PASSWORD || "";
        const fromName = s.smtp_from_name || "My PCC Admin";
        const fromEmail = s.smtp_from_email || process.env.SMTP_FROM || user;

        if (!user || !pass) {
            return NextResponse.json({ error: "SMTP Username or App Password is not set via Settings or Environment Variables." }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });

        await transporter.verify();

        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: toEmail,
            subject: "My PCC – SMTP Gateway Test",
            text: "Hello! If you are seeing this email, your SMTP Gateway settings are correctly configured in the My PCC Admin Dashboard.",
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
                <h2 style="color:#6c47ff;text-align:center;">My PCC – SMTP Gateway Test</h2>
                <p>Hello,</p>
                <p>If you are seeing this email, your SMTP Gateway configurations in the My PCC Admin Dashboard are healthy and active.</p>
                <p style="font-size:13px;color:#64748b;">You can safely ignore this test email.</p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
                <p style="font-size:11px;color:#94a3b8;text-align:center;">© ${new Date().getFullYear()} Presbyterian Church in Cameroon</p>
              </div>
            `,
        });

        return NextResponse.json({ message: "Test broadcast dispatched successfully!" });
    } catch (err: any) {
        console.error("Test email error:", err);
        return NextResponse.json({ error: "Failed to send: " + err.message }, { status: 500 });
    }
}
