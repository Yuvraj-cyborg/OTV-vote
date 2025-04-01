const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, sendOTP, googleAuth } = require('../controllers/authController');
const { authenticateToken } = require("../middleware/auth");

// Register route (without image upload)
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', authenticateToken, getUserProfile);

// Send OTP route
router.post('/send-otp', sendOTP);

// Google OAuth route
router.post('/google', googleAuth);  // Add this

module.exports = router;
