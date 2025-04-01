const express = require('express');
const multer = require("multer");
const { createNomination,fetchNominations,approveNominee,getApprovedNominations,fetchUserDetails,createRazorpayOrder,getRazorpayKey,rejectNominee,getUserNominations, fetchNominationsWithEmails } = require('../controllers/nominationController.js');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Use memory storage for file uploads (for Supabase integration)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add authentication to nomination endpoints
router.post('/nominate', authenticateToken, upload.single('nomineePhoto'), (req, res, next) => {
    console.log("Nomination file received:", req.file ? {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : "No file received");
    console.log("Authenticated user:", req.user.userId); // Log the authenticated user's email
    next();
  }, createNomination);

// Create Razorpay order (authenticated)
router.post('/create-order', authenticateToken, createRazorpayOrder);
router.get('/by-email/:email', authenticateToken, fetchNominationsWithEmails); // Fetch nominations by email

router.get('/', fetchNominations); // Fetch all nominations
router.post('/:id/approve', authenticateToken, approveNominee);
router.get('/profileDetails', fetchUserDetails)
router.get('/approved', getApprovedNominations); // Fetch approved nominations
router.get('/razorpay-key', getRazorpayKey);
router.post("/:id/reject", authenticateToken, rejectNominee);

// Add route to fetch user's nominations (requires authentication)
router.get('/user', authenticateToken, getUserNominations);

module.exports = router;
