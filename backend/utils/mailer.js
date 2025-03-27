const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.SMTP_EMAIL, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app-specific password
  },

});
console.log("EMAIL_USER:", process.env.SMTP_EMAIL);
console.log("EMAIL_PASS:", process.env.SMTP_PASS ? "Loaded" : "Not Loaded");
/**
 * Send an OTP email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP to send
 */
const sendOTPEmail = async (userId, username, otp) => {
  try {
    // Render the EJS template
    const templatePath = path.join(__dirname, "../templates/otpEmail.ejs");
    const html = await ejs.renderFile(templatePath, { user: { username }, activationCode: otp });

    // Email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: userId,
      subject: "Your OTP for Signup",
      html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = { sendOTPEmail };