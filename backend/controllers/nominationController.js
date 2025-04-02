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

// Function to upload file to Supabase
const uploadToSupabase = async (file) => {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    console.log("Uploading file to Supabase:", {
      originalName: file.originalname,
      filename,
      size: file.size,
      mimetype: file.mimetype
    });

    // Upload the file to Supabase
    const { data, error } = await supabase.storage
      .from('nominees-photos')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('nominees-photos')
      .getPublicUrl(filename);

    console.log("File uploaded successfully:", publicUrl);

    return {
      fileUrl: publicUrl
    };
  } catch (error) {
    console.error("Error in uploadToSupabase:", error);
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
    
    console.log("Received nomination data:", {
      nomineeName,
      hasFile: !!req.file,
      categoryIds,
      paymentId,
      orderId
    });

    // Validate that a photo was uploaded
    if (!req.file) {
      console.error("No photo uploaded");
      return res.status(400).json({
        error: "Photo required",
        message: "Please upload a photo for your nomination."
      });
    }

    // Use authenticated user's email from token
    const userEmail = req.user.userId;
    console.log("Using authenticated user's email:", userEmail);

    // Check if user has already submitted a nomination
    const existingNomination = await prisma.nomination.findFirst({
      where: { nomineeEmail: userEmail }
    });

    if (existingNomination) {
      console.log("User already has a nomination with ID:", existingNomination.id);
      return res.status(400).json({ 
        error: "Nomination limit reached", 
        message: "You have already submitted a nomination. Only one nomination is allowed per user." 
      });
    }

    // Upload the file to Supabase
    console.log("Processing file upload:", req.file.originalname);
    let fileUrl;
    try {
      const response = await uploadToSupabase(req.file);
      fileUrl = response.fileUrl;
      console.log("File uploaded successfully, URL:", fileUrl);
    } catch (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError);
      return res.status(400).json({
        error: "File upload failed",
        message: "Failed to upload the photo. Please try again."
      });
    }

    // Parse category IDs (they come as a JSON string from form data)
    let parsedCategoryIds;
    try {
      parsedCategoryIds = JSON.parse(categoryIds);
      console.log("Parsed category IDs:", parsedCategoryIds);
      
      // Validate category IDs
      if (!Array.isArray(parsedCategoryIds) || parsedCategoryIds.length === 0) {
        throw new Error("Category IDs must be a non-empty array");
      }
    } catch (error) {
      console.error("Error parsing categoryIds:", error);
      return res.status(400).json({ 
        error: "Invalid category IDs format",
        message: "Please select at least one category"
      });
    }

    // Create the nomination
    console.log("Creating nomination with data:", {
      nomineeName, 
      email: userEmail, 
      categories: parsedCategoryIds.length
    });
    
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
    
    console.log("Nomination created with ID:", nomination.id);

    // Then create category connections
    try {
      await prisma.nominationCategory.createMany({
        data: parsedCategoryIds.map(categoryId => ({
          nominationId: nomination.id,
          categoryId: parseInt(categoryId)
        }))
      });
      console.log("Category connections created successfully");
    } catch (error) {
      console.error("Error creating category connections:", error);
      // Delete the nomination if category connections fail
      await prisma.nomination.delete({ where: { id: nomination.id } });
      throw error;
    }

    // Create payment record if payment details are provided
    if (paymentId && orderId) {
      console.log("Creating payment record with:", {paymentId, orderId});
      await prisma.payment.create({
        data: {
          paymentId,
          orderId,
          amount: 100, // ₹1 in paise
          status: "completed",
          currency: "INR",
          nomination: { connect: { id: nomination.id } }
        }
      });
      console.log("Payment record created");
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
    console.error("Error creating nomination:", error);
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
    console.error("🔥 Error fetching nominations:", error);
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
    console.log("Creating Razorpay order for user:", req.user.userId);

    // Hardcode the amount to ₹1 (100 paise)
    const amount = 100; // ₹1 in paise (100 paise = ₹1)

    // Create an order using Razorpay API
    const order = await razorpayInstance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `nomination_${Date.now()}`,
    });

    console.log("Order created successfully:", order);

    // Return the order details
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
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
    // Get user's email from the userId field in the user object
    const userEmail = req.user.userId; 
    
    console.log("Fetching nominations for user email:", userEmail);

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
    
    console.log(`Found ${userNominations.length} nominations for user ${userEmail}`);

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
  fetchNominationsWithEmails,
};