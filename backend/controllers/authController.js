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
dotenv.config(); // Load environment variables

const prisma = new PrismaClient();

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Multer Config (Memory Storage for Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
const registerUser = async (req, res) => {
  const { userId, username, password, otp } = req.body;

  if (!userId || !username || !password || !otp) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Verify OTP
    const isOTPValid = await verifyOTP(userId, otp);
    if (!isOTPValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
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

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & return token
 */
const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 */
const getUserProfile = async (req, res) => {
  try {
    console.log("Request User:", req.user); // Check if middleware is passing the user

    if (!req.user) {
      console.error("User not found in request object");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { userId: req.user.userId },  // Ensure 'id' is correct
      select: {
        username: true,
        photo: true,
      },
    });

    if (!user) {
      console.error("User not found in database for ID:", req.user.userId);
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: error.message });  // Return actual error message
  }
};


/**
 * @route POST /api/auth/send-otp
 * @desc Send OTP to user's email
 */
const sendOTP = async (req, res) => {
  const { userId, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis
    await storeOTP(userId, otp);

    // Send OTP via email
    await sendOTPEmail(userId, username, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


/**
 * @route POST /api/auth/google
 * @desc Authenticate user with Google & return token
 */
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { userId: email } // Using email as userId
    });

    // If user doesn't exist, create new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          userId: email,
          username: name,
          photo: picture,
          provider: 'google',
          password: '' // Empty password for Google users
        }
      });
    }

    // Generate JWT token
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

// Export functions
module.exports = {sendOTP, registerUser, loginUser, getUserProfile,googleAuth, upload };
