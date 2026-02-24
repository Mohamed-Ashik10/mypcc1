require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log("Starting SMTP Test...");
    console.log("Host:", process.env.SMTP_HOST || "smtp.gmail.com");
    console.log("Port:", process.env.SMTP_PORT || "587");
    console.log("User:", process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ SMTP Connection Successful!");

        const info = await transporter.sendMail({
            from: `"My PCC Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: "SMTP Test Email",
            text: "If you see this, your SMTP settings are correct!",
        });

        console.log("✅ Test email sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ SMTP Error:", error.message);
        if (error.message.includes("Application-specific password required")) {
            console.log("👉 Suggestion: You need to generate an 'App Password' from Google Security settings.");
        } else if (error.message.includes("Invalid login")) {
            console.log("👉 Suggestion: Double-check your SMTP_USER and SMTP_PASSWORD.");
        }
    }
}

testEmail();
