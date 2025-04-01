const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { submitVote, getVotesForCategory } = require("../controllers/voteController");

const router = express.Router();

// Vote submission route (protected)
router.post("/", authenticateToken, submitVote);

// Get votes by category
router.get("/:categoryId", getVotesForCategory);

module.exports = router;