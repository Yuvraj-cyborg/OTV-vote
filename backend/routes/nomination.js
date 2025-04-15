const express = require('express');
const multer = require("multer");
const { createNomination,fetchNominations,approveNominee,getApprovedNominations,fetchUserDetails,createRazorpayOrder,getRazorpayKey,rejectNominee,getUserNominations, fetchNominationsWithEmails, fetchNominationsWithTotalVotes, recordPayment, verifyPayment, reconcilePayments } = require('../controllers/nominationController.js');
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

// Add route to fetch all nominations with total vote counts (for admin panel)
router.get('/with-total-votes', (req, res, next) => {
  // Check for adminToken in headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  const adminCredential = Buffer.from("admin@odishatv.in:Odishatv@password").toString('base64');
  
  if (token && token === adminCredential) {
    // If adminToken is valid, set req.user to bypass authentication
    req.user = { userId: "admin@odishatv.in" };
    return next();
  }
  
  // Otherwise, proceed with regular authentication
  authenticateToken(req, res, next);
}, fetchNominationsWithTotalVotes);

// New payment-related routes
router.post('/record-payment', authenticateToken, recordPayment);
router.get('/verify-payment/:paymentId', authenticateToken, verifyPayment);
router.get('/reconcile-payments', reconcilePayments); // Admin-only route with internal auth check

module.exports = router;
