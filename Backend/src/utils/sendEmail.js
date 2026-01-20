// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.GMAIL_USER, // careersyn3@gmail.com
    pass: process.env.GMAIL_APP_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
  // Add timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.error("sendEmail ERROR: missing recipient email");
    throw new Error("Recipient email missing");
  }

  const mailOptions = {
    from: `"CareerSync Security" <${process.env.GMAIL_USER}>`,
    to: to.trim(),
    subject,
    html,
    text: html.replace(/<[^>]*>/g, ""), // important: plain text fallback
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
