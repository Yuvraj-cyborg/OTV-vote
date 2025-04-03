const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
const { sendOTPEmail } = require("../utils/mailer");
const { storeOTP, verifyOTP } = require("../utils/redis");
const dotenv = require("dotenv");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
dotenv.config(); 

const prisma = new PrismaClient();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const registerUser = async (req, res) => {
  const { userId, username, password, otp } = req.body;

  if (!userId || !username || !password || !otp) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const isOTPValid = await verifyOTP(userId, otp);
    if (!isOTPValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userId,
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "User registration failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.userId}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { userId: req.user.userId },
      select: {
        username: true,
        userId: true,  
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: error.message });  
  }
};

const sendOTP = async (req, res) => {
  const { userId, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await storeOTP(userId, otp);

    await sendOTPEmail(userId, username, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await prisma.user.findUnique({
      where: { userId: email } 
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          userId: email,
          username: name,
          photo: picture,
          provider: 'google',
          password: '' 
        }
      });
    }

    const jwtToken = jwt.sign(
      { userId: user.userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token: jwtToken,
      user: {
        username: user.username,
        photo: user.photo
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

module.exports = {sendOTP, registerUser, loginUser, getUserProfile,googleAuth, upload };
