const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
const Razorpay = require("razorpay"); // Use `Razorpay` instead of `razorpay` to avoid conflict
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();

// Initialize Razorpay
console.log("Initializing Razorpay with key_id:", process.env.RAZORPAY_KEY_ID);
console.log("Key secret length:", process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 0);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const createNomination = async (req, res) => {
  try {
    // Extract form data
    const {
      nomineeName,
      nomineeEmail,
      categoryIds,
      instagramUrl,
      facebookId,
      xId,
      youtubeId,
      paymentId,
      orderId
    } = req.body;

    // Check if user has already submitted a nomination
    const existingNomination = await prisma.nomination.findFirst({
      where: { nomineeEmail: nomineeEmail }
    });

    if (existingNomination) {
      return res.status(400).json({ 
        error: "Nomination limit reached", 
        message: "You have already submitted a nomination. Only one nomination is allowed per user." 
      });
    }

    // Get the file if uploaded
    let fileUrl = null;
    if (req.file) {
      const response = await uploadToSupabase(req.file);
      fileUrl = response.fileUrl;
    }

    // Parse category IDs (they come as a JSON string from form data)
    let parsedCategoryIds;
    try {
      parsedCategoryIds = JSON.parse(categoryIds);
    } catch (error) {
      console.error("Error parsing categoryIds:", error);
      return res.status(400).json({ error: "Invalid category IDs format" });
    }

    // Create the nomination
    const nomination = await prisma.nomination.create({
      data: {
        nomineeName,
        nomineeEmail,
        nomineePhoto: fileUrl,
        instagramUrl,
        facebookId,
        xId,
        youtubeId,
        // Create category connections
        categories: {
          create: parsedCategoryIds.map(categoryId => ({
            category: { connect: { id: parseInt(categoryId) } }
          }))
        },
      },
    });

    // Create payment record
    if (paymentId && orderId) {
      await prisma.payment.create({
        data: {
          paymentId,
          orderId,
          amount: 100, // ₹1 in paise
          status: "completed",
          nomination: { connect: { id: nomination.id } }
        }
      });
    }

    // Return the created nomination
    res.status(201).json({
      message: "Nomination created successfully",
      nomination
    });
  } catch (error) {
    console.error("Error creating nomination:", error);
    res.status(500).json({ error: "Failed to create nomination" });
  }
};

const fetchNominations = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = categoryId ? { categories: { some: { categoryId: parseInt(categoryId) } } } : {};

    const nominations = await prisma.nomination.findMany({
      where: whereClause,
      include: { categories: { select: { categoryId: true } } },
    });

    res.status(200).json(nominations);
  } catch (error) {
    console.error("🔥 Error fetching nominations:", error);
    res.status(500).json({ error: "Failed to fetch nominations" });
  }
};

const approveNominee = async (req, res) => {
  try {
    const { id } = req.params;

    const nominee = await prisma.nomination.update({
      where: { id: parseInt(id) },
      data: { status: "approved" },
    });

    res.status(200).json(nominee);
  } catch (error) {
    console.error("🔥 Error approving nominee:", error);
    res.status(500).json({ error: "Failed to approve nominee." });
  }
};

const getApprovedNominations = async (req, res) => {
  try {
    const approvedNominations = await prisma.nomination.findMany({
      where: { status: "approved" },
      include: { categories: true },
    });
    res.status(200).json(approvedNominations);
  } catch (error) {
    console.error("🔥 Error fetching approved nominations:", error);
    res.status(500).json({ error: "Failed to fetch approved nominations. Please try again later." });
  }
};

const fetchNominationsWithVotes = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = categoryId ? { categories: { some: { categoryId: parseInt(categoryId) } } } : {};

    const nominations = await prisma.nomination.findMany({
      where: whereClause,
      include: { categories: { select: { categoryId: true } } },
    });

    res.status(200).json(nominations);
  } catch (error) {
    console.error("🔥 Error fetching nominations:", error);
    res.status(500).json({ error: "Failed to fetch nominations" });
  }
};

const fetchUserDetails = async (req, res) => {
  try {
    const nominations = await prisma.nomination.findMany({
      select: {
        nomineeName: true,
        nomineeEmail: true,
        nomineePhoto: true,
        instagramUrl: true,
        facebookId: true,
        xId: true,
        youtubeId: true,
        categories: {
          select: { category: { select: { name: true } } },
        },
      },
    });

    const formattedNominations = nominations.map(nominee => ({
      nomineeName: nominee.nomineeName,
      nomineeEmail: nominee.nomineeEmail,
      nomineePhoto: nominee.nomineePhoto,
      instagramUrl: nominee.instagramUrl,
      facebookId: nominee.facebookId,
      xId: nominee.xId,
      youtubeId: nominee.youtubeId,
      categories: nominee.categories.map(cat => cat.category.name),
    }));

    res.status(200).json(formattedNominations);
  } catch (error) {
    console.error("🔥 Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    console.log("Creating mock Razorpay order for testing...");
    
    // Generate a mock order ID
    const orderId = `order_${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Create a mock order response that mimics Razorpay's response format
    const mockOrder = {
      id: orderId,
      entity: "order",
      amount: 100,
      amount_paid: 0,
      amount_due: 100,
      currency: "INR",
      receipt: `nomination_${Date.now()}`,
      status: "created",
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000)
    };
    
    console.log("Mock order created successfully:", mockOrder);
    
    // Return mock order details
    res.status(200).json(mockOrder);
  } catch (error) {
    console.error("Error creating mock Razorpay order:", error);
    res.status(500).json({ 
      error: "Failed to create order",
      message: error.message
    });
  }
};

const handlePayment = async (nominationData) => {
  try {
    // Hardcode the amount to ₹1 (100 paise)
    const amount = 100; // ₹1 in paise (100 paise = ₹1)

    // Create a Razorpay order
    const order = await createRazorpayOrder({
      amount: amount,
      currency: "INR",
      receipt: `nomination_${Date.now()}`,
    });

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Nomination Payment",
      description: "Payment for nomination submission",
      handler: async (response) => {
        console.log("Payment successful:", response);
        const submissionResponse = await submitNomination({
          ...nominationData,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
        alert("Nomination submitted successfully!");
      },
      prefill: {
        name: nominationData.nomineeName,
        email: nominationData.nomineeEmail,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error during payment:", error);
    alert("Payment failed. Please try again.");
  }
};

const getRazorpayKey = async (req, res) => {
  try {
    // Return the Razorpay key
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    res.status(500).json({ error: "Failed to fetch Razorpay key" });
  }
};

const rejectNominee = async (req, res) => {
  try {
    const { id } = req.params;

    // Update the nominee status to "rejected"
    const nominee = await prisma.nomination.update({
      where: { id: parseInt(id) },
      data: { status: "rejected" },
    });

    res.status(200).json(nominee);
  } catch (error) {
    console.error("🔥 Error rejecting nominee:", error);
    res.status(500).json({ error: "Failed to reject nominee." });
  }
};

const getUserNominations = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from JWT token

    // Find all nominations submitted by this user based on email
    const userNominations = await prisma.nomination.findMany({
      where: { nomineeEmail: req.user.email },
      include: { 
        categories: { 
          select: { 
            category: { select: { id: true, name: true } } 
          } 
        },
        payments: true 
      },
    });

    res.status(200).json(userNominations);
  } catch (error) {
    console.error("Error fetching user nominations:", error);
    res.status(500).json({ error: "Failed to fetch nominations" });
  }
};

module.exports = {
  createNomination,
  fetchNominations,
  approveNominee,
  getApprovedNominations,
  fetchNominationsWithVotes,
  fetchUserDetails,
  createRazorpayOrder,
  handlePayment,
  getRazorpayKey,
  rejectNominee,
  getUserNominations,
};