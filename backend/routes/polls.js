const express = require("express");
const { createPoll, getPolls } = require("../controllers/pollController");
const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const deletePoll = require("../controllers/pollController");
const router = express.Router();

router.post("/", authMiddleware, createPoll);

router.get("/", getPolls);



module.exports = router;