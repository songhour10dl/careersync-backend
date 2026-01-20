// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const createTransporter = async () => {
  // Verify all required env vars are present
  const requiredVars = [
    "GMAIL_USER",
    "GMAIL_CLIENT_ID",
    "GMAIL_CLIENT_SECRET",
    "GMAIL_REFRESH_TOKEN",
  ];
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.error("❌ sendEmail ERROR: missing recipient email");
    throw new Error("Recipient email missing");
  }

  const mailOptions = {
    from: `"CareerSync Security" <${process.env.GMAIL_USER}>`,
    to: to.trim(),
    subject,
    html,
    text: html.replace(/<[^>]*>/g, ""), // plain text fallback
  };

  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    throw error;
  }
};

module.exports = sendEmail;
