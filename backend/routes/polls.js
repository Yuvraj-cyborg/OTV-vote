const express = require("express");
const { createPoll, getPolls } = require("../controllers/pollController");
const { authenticateToken } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const deletePoll = require("../controllers/pollController");
const router = express.Router();

// Protected route for creating a poll
router.post("/", authenticateToken, createPoll);

// Public route for getting all polls
router.get("/", getPolls);

module.exports = router;