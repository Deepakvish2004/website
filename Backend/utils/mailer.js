const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
  port: process.env.SMTP_PORT, // 465 for SSL, 587 for TLS
  secure: process.env.SMTP_PORT == 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail({ to, subject, text, html }) {
  try {
    let info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email send error:", err);
  }
}

module.exports = { sendMail };
