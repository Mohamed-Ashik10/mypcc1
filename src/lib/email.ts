import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");

  // Diagnostic check for environment variables
  console.log("Email Config Check (Live):", {
    hasUser: !!user,
    userValue: user ? `${user.substring(0, 3)}...` : "MISSING",
    hasPass: !!pass,
    passLength: pass?.length || 0,
    host,
    port,
    nextAuthUrl: !!process.env.NEXTAUTH_URL
  });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  try {
    await transporter.verify();
    console.log("SMTP Transporter verified successfully");
  } catch (verifyError) {
    console.error("SMTP Transporter verification failed:", verifyError);
    throw verifyError;
  }

  const mailOptions = {
    from: `"My PCC Support" <${process.env.SMTP_FROM || user}>`,
    to: email,
    subject: "Reset Your Password - My PCC",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb; text-align: center;">My PCC Admin Dashboard</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to choose a new one:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">© ${new Date().getFullYear()} Presbyterian Church in Cameroon</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
