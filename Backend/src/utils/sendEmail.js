// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // careersyn3@gmail.com
    pass: process.env.GMAIL_APP_PASS, // Gmail App Password
  },

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

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
