const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const pollRoutes = require("./routes/polls");
const voteRoutes = require("./routes/votes");
const nominationRoutes = require("./routes/nomination");
const categoryRoutes = require("./routes/category"); // Import category routes
const adminRoutes = require('./routes/admin');


const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173','https://otv-vote.vercel.app','https://otvinsight.com','https://admin.otvinsight.com','https://www.otvinsight.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/nominations", nominationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", adminRoutes);

// Serve static files
app.use(express.static("public"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
