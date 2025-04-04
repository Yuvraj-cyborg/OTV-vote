const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require('@prisma/client');

// Create Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Allow all origins
app.use(cors({ origin: "*", credentials: true }));

// ✅ Allow specific origins (if needed)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://otv-vote.vercel.app",
    "https://otvinsight.com",
    "https://admin.otvinsight.com",
    "https://www.otvinsight.com"
  ],
  credentials: true
}));

// Import routes
const authRoutes = require('./routes/auth');
const nominationRoutes = require('./routes/nomination');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/category');
const voteRoutes = require('./routes/votes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/nominations', nominationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api', adminRoutes);

// ✅ Set CORS headers manually (important for static files)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Serve static files
app.use(express.static("public"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
