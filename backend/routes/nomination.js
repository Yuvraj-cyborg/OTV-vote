const express = require('express');
const multer = require("multer");
const { createNomination,fetchNominations,approveNominee,getApprovedNominations,fetchUserDetails,createRazorpayOrder,getRazorpayKey,rejectNominee,getUserNominations } = require('../controllers/nominationController.js');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Use memory storage for file uploads (for Supabase integration)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/nominate', upload.single('nomineePhoto'), (req, res, next) => {
    console.log("Nomination file received:", req.file);
    next();
  }, createNomination);

  router.post('/create-order', createRazorpayOrder);

  
  router.get('/', fetchNominations); // Fetch all nominations
  router.post('/:id/approve', approveNominee);
  router.get('/profileDetails',fetchUserDetails)
  router.get('/approved', getApprovedNominations); // Fetch approved nominations
  router.get('/razorpay-key', getRazorpayKey);
  router.post("/:id/reject", rejectNominee);

// Add route to fetch user's nominations (requires authentication)
router.get('/user', authenticateToken, getUserNominations);

module.exports = router;
