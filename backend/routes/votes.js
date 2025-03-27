const express = require("express");
const { submitVote, getVotesForCategory } = require("../controllers/voteController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Submit a vote (protected route)
router.post("/", authMiddleware, submitVote);
router.get("/:categoryId", getVotesForCategory);

module.exports = router;