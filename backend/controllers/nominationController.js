const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
const Razorpay = require("razorpay"); 
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Function to upload file to Supabase
const uploadToSupabase = async (file) => {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Upload the file to Supabase
    const { data, error } = await supabase.storage
      .from('nominees-photos')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('nominees-photos')
      .getPublicUrl(filename);

    return {
      fileUrl: publicUrl
    };
  } catch (error) {
    throw error;
  }
};

const createNomination = async (req, res) => {
  try {
    // Extract form data
    const {
      nomineeName,
      categoryIds,
      instagramUrl,
      facebookId,
      xId,
      youtubeId,
      paymentId,
      orderId
    } = req.body;
    
    // Validate that a photo was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: "Photo required",
        message: "Please upload a photo for your nomination."
      });
    }

    // Use authenticated user's email from token
    const userEmail = req.user.userId;

    // Check if user has already submitted a nomination
    const existingNomination = await prisma.nomination.findFirst({
      where: { nomineeEmail: userEmail }
    });

    if (existingNomination) {
      return res.status(400).json({ 
        error: "Nomination limit reached", 
        message: "You have already submitted a nomination. Only one nomination is allowed per user." 
      });
    }

    // Upload the file to Supabase
    let fileUrl;
    try {
      const response = await uploadToSupabase(req.file);
      fileUrl = response.fileUrl;
    } catch (uploadError) {
      return res.status(400).json({
        error: "File upload failed",
        message: "Failed to upload the photo. Please try again."
      });
    }

    // Parse category IDs (they come as a JSON string from form data)
    let parsedCategoryIds;
    try {
      parsedCategoryIds = JSON.parse(categoryIds);
      
      // Validate category IDs
      if (!Array.isArray(parsedCategoryIds) || parsedCategoryIds.length === 0) {
        throw new Error("Category IDs must be a non-empty array");
      }
    } catch (error) {
      return res.status(400).json({ 
        error: "Invalid category IDs format",
        message: "Please select at least one category"
      });
    }

    // Create the nomination
    // First create the nomination without categories
    const nomination = await prisma.nomination.create({
      data: {
        nomineeName,
        nomineeEmail: userEmail,
        nomineePhoto: fileUrl,
        instagramUrl: instagramUrl || null,
        facebookId: facebookId || null,
        xId: xId || null,
        youtubeId: youtubeId || null,
      },
    });
    
    // Then create category connections
    try {
      await prisma.nominationCategory.createMany({
        data: parsedCategoryIds.map(categoryId => ({
          nominationId: nomination.id,
          categoryId: parseInt(categoryId)
        }))
      });
    } catch (error) {
      // Delete the nomination if category connections fail
      await prisma.nomination.delete({ where: { id: nomination.id } });
      throw error;
    }

    // Create payment record if payment details are provided
    if (paymentId && orderId) {
      await prisma.payment.create({
        data: {
          paymentId,
          orderId,
          nominationId: nomination.id,
          amount: 29900, // ₹299 in paise
          currency: "INR", // Required field
          status: "completed"
        },
      });
      console.log(`Payment record created for nomination ${nomination.id}`);
    }

    // Return the created nomination with categories
    const nominationWithCategories = await prisma.nomination.findUnique({
      where: { id: nomination.id },
      include: {
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: "Nomination created successfully",
      nomination: nominationWithCategories
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to create nomination",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
    res.status(500).json({ error: "Failed to fetch nominations" });
  }
};

const fetchNominationsWithEmails = async (req, res) => {
  try {
    const { email } = req.query;
    const nominations = await prisma.nomination.findMany({
      where: { nomineeEmail: email },
      include: { categories: true }
    });
    res.json(nominations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const approveNominee = async (req, res) => {
  try {
    const { id } = req.params;

    const nominee = await prisma.nomination.update({
      where: { id: parseInt(id) },
      data: { status: "approved" },
    });

    res.status(200).json(nominee);
  } catch (error) {
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
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    console.log("Creating Razorpay order, authenticated user:", req.user?.userId);
    
    // Get the authenticated user
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Set nomination fee amount (299 rupees in paise)
    const amount = 29900; // ₹299 in paise (100 paise = ₹1)

    // Create an order using Razorpay API
    const order = await razorpayInstance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `nomination_${Date.now()}`,
      notes: {
        userId: req.user.userId
      }
    });

    console.log("Razorpay order created:", order.id);

    // Return the order details
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      error: "Failed to create order",
      message: error.message,
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
        const submissionResponse = await submitNomination({
          ...nominationData,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
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
    alert("Payment failed. Please try again.");
  }
};

const getRazorpayKey = async (req, res) => {
  try {
    // Return the Razorpay key
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
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
    res.status(500).json({ error: "Failed to reject nominee." });
  }
};

const getUserNominations = async (req, res) => {
  try {
    // Get user's email from the userId field in the user object
    const userEmail = req.user.userId; 
    
    // Find all nominations submitted by this user based on email
    const userNominations = await prisma.nomination.findMany({
      where: { nomineeEmail: userEmail },
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
  fetchNominationsWithEmails,
};