import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

// Load SMTP settings from DB, fall back to .env
async function getSmtpConfig() {
  let host = process.env.SMTP_HOST || "smtp.gmail.com";
  let port = parseInt(process.env.SMTP_PORT || "587");
  let user = process.env.SMTP_USER || "";
  let pass = process.env.SMTP_PASSWORD || "";
  let fromName = "My PCC Support";
  let fromEmail = process.env.SMTP_FROM || user;

  try {
    const rows = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_name", "smtp_from_email"],
        },
      },
    });
    const s: Record<string, string> = {};
    for (const r of rows) s[r.key] = r.value;

    if (s.smtp_host) host = s.smtp_host;
    if (s.smtp_port) port = parseInt(s.smtp_port);
    if (s.smtp_user) user = s.smtp_user;
    if (s.smtp_pass) pass = s.smtp_pass;
    if (s.smtp_from_name) fromName = s.smtp_from_name;
    if (s.smtp_from_email) fromEmail = s.smtp_from_email;
  } catch {
    // DB unavailable — use .env values silently
  }

  return { host, port, user, pass, fromName, fromEmail };
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const { host, port, user, pass, fromName, fromEmail } = await getSmtpConfig();

  console.log("Email Config:", { host, port, hasUser: !!user, hasPass: !!pass });

  if (!user || !pass) {
    throw new Error("SMTP credentials not configured. Set them in Admin → Settings → Email.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  // Priority: VERCEL_PROJECT_PRODUCTION_URL (stable) > NEXTAUTH_URL > localhost fallback
  const baseUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes("localhost")
        ? process.env.NEXTAUTH_URL
        : "https://mypcc1-ebt4.vercel.app"; // hardcoded production fallback

  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  await transporter.verify();

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: "Reset Your Password – My PCC",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="color:#6c47ff;text-align:center;">My PCC – Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to choose a new one:</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${resetUrl}"
             style="background:#6c47ff;color:white;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size:13px;color:#64748b;">If you didn't request this, you can safely ignore this email. This link expires in <strong>1 hour</strong>.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
        <p style="font-size:11px;color:#94a3b8;text-align:center;">© ${new Date().getFullYear()} Presbyterian Church in Cameroon</p>
      </div>
    `,
  });
};
