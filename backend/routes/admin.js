const express = require('express');
const { getCurrentPhase, togglePhase } = require('../controllers/adminController');
const router = express.Router();

// Get current phase
router.get('/phase', getCurrentPhase);

// Toggle phase
router.post('/phase/toggle', togglePhase);

module.exports = router;