const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
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
