const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getCurrentPhase, togglePhase } = require('../controllers/adminController');

// Get current phase
router.get('/phase', getCurrentPhase);

// Toggle phase (protected)
router.post('/phase/toggle', authenticateToken, togglePhase);

module.exports = router;