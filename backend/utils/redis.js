const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Redis client with error handling
const redis = new Redis(process.env.REDIS_URL);

redis.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err);
});

/**
 * Store OTP in Redis
 * @param {string} userId - User ID (used as key in Redis)
 * @param {string} otp - OTP to store
 * @param {number} ttl - Time-to-live in seconds (default: 300s = 5 minutes)
 */
const storeOTP = async (userId, otp, ttl = 300) => {
  try {
    await redis.setex(userId, ttl, otp);
    console.log(`✅ OTP stored for ${userId}: ${otp}`);
  } catch (error) {
    console.error("❌ Error storing OTP in Redis:", error);
    throw error;
  }
};

/**
 * Verify OTP from Redis
 * @param {string} userId - User ID
 * @param {string} otp - OTP to verify
 * @returns {boolean} True if OTP matches, else false
 */
const verifyOTP = async (userId, otp) => {
  try {
    const storedOTP = await redis.get(userId);
    console.log(`🔍 Verifying OTP: UserID=${userId}, Stored=${storedOTP}, Input=${otp}`);
    
    if (!storedOTP) {
      console.warn(`⚠️ No OTP found for ${userId}`);
      return false;
    }

    return storedOTP === otp;
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    throw error;
  }
};

// Export functions
module.exports = { storeOTP, verifyOTP };
