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
  let paymentRecord = null;
  
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
    
    // If payment details are provided, record the payment first
    if (paymentId && orderId) {
      try {
        // Check if payment already exists
        const existingPayment = await prisma.payment.findFirst({
          where: { 
            OR: [
              { paymentId },
              { orderId }
            ]
          }
        });
        
        if (existingPayment) {
          paymentRecord = existingPayment;
          console.log(`Using existing payment record: ${paymentId}`);
        } else {
          // Create a new payment record
          paymentRecord = await prisma.payment.create({
            data: {
              paymentId,
              orderId,
              status: "completed",
              amount: 29900, // ₹299 in paise
              currency: "INR"
              // Don't link to nomination yet - will update after nomination creation
            }
          });
          console.log(`Payment record created with ID: ${paymentRecord.id}`);
        }
      } catch (paymentError) {
        console.error("Error recording payment:", paymentError);
        // Continue with nomination - we'll try to link the payment later
      }
    }

    // Validate that a photo was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: "Photo required",
        message: "Please upload a photo for your nomination.",
        paymentRecorded: paymentRecord !== null
      });
    }

    // Validate file size (512KB = 524288 bytes)
    if (req.file.size > 524288) {
      return res.status(400).json({
        error: "File too large",
        message: "Image size exceeds 512KB limit. Please select a smaller image.",
        paymentRecorded: paymentRecord !== null
      });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        error: "Invalid file type",
        message: "Please upload a valid image file (PNG, JPG).",
        paymentRecorded: paymentRecord !== null
      });
    }

    // Use authenticated user's email from token
    const userEmail = req.user.userId;

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

    // Convert all category IDs to integers
    parsedCategoryIds = parsedCategoryIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    // Upload the file to Supabase first
    let fileUrl;
    try {
      const response = await uploadToSupabase(req.file);
      fileUrl = response.fileUrl;
    } catch (uploadError) {
      return res.status(400).json({
        error: "File upload failed",
        message: "Failed to upload the photo. Please try again.",
        paymentRecorded: paymentRecord !== null
      });
    }

    // Use a transaction to ensure all database operations succeed or fail together
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Check if user has already submitted a nomination - do this first within the transaction
        const existingNomination = await tx.nomination.findFirst({
          where: { nomineeEmail: userEmail }
        });

        if (existingNomination) {
          // If nomination exists and payment record exists, link them
          if (paymentRecord && !paymentRecord.nominationId) {
            await prisma.payment.update({
              where: { id: paymentRecord.id },
              data: { nominationId: existingNomination.id }
            });
          }
          
          throw new Error("You have already submitted a nomination. Only one nomination is allowed per user.");
        }

        // Find which categories actually exist in the database
        const validCategories = await tx.category.findMany({
          where: {
            id: {
              in: parsedCategoryIds
            }
          },
          select: {
            id: true
          }
        });
        
        const validCategoryIds = validCategories.map(cat => cat.id);
        
        // Log if there are invalid categories, but don't fail the nomination
        if (validCategoryIds.length < parsedCategoryIds.length) {
          console.warn(`User ${userEmail} submitted some invalid category IDs. Original: ${JSON.stringify(parsedCategoryIds)}, Valid: ${JSON.stringify(validCategoryIds)}`);
        }
        
        if (validCategoryIds.length === 0) {
          throw new Error("No valid categories selected. Please select at least one valid category.");
        }

        // Create the nomination record
        const nomination = await tx.nomination.create({
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
        
        // Create the category connections
        await tx.nominationCategory.createMany({
          data: validCategoryIds.map(categoryId => ({
            nominationId: nomination.id,
            categoryId: categoryId
          }))
        });
        
        // Link payment if it exists
        if (paymentRecord) {
          await tx.payment.update({
            where: { id: paymentRecord.id },
            data: { nominationId: nomination.id }
          });
        }
        
        // Fetch the complete nomination with categories for the response
        return await tx.nomination.findUnique({
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
      });

      res.status(201).json({
        message: "Nomination created successfully",
        nomination: result,
        paymentRecorded: paymentRecord !== null
      });
    } catch (error) {
      // Handle database constraint violations
      if (error.code === 'P2002' && error.meta?.target?.includes('nomineeEmail')) {
        return res.status(400).json({ 
          error: "Nomination limit reached", 
          message: "You have already submitted a nomination. Only one nomination is allowed per user.",
          paymentRecorded: paymentRecord !== null
        });
      }
      // Handle other errors
      return res.status(500).json({ 
        error: "Failed to create nomination",
        message: error.message,
        paymentRecorded: paymentRecord !== null
      });
    }
  } catch (error) {
    console.error("Nomination creation error:", error);
    res.status(500).json({ 
      error: "Failed to create nomination",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      paymentRecorded: paymentRecord !== null
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
    const amount = 29900; // ₹299 in paise (29900 paise = ₹1)

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
    // Set nomination fee amount (299 rupees in paise)
    const amount = 29900; // ₹299 in paise (29900 paise = ₹1)

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

// Add a new function to record payments
const recordPayment = async (req, res) => {
  try {
    const { paymentId, orderId, nomineeEmail, amount = 29900, currency = "INR" } = req.body;
    
    if (!paymentId || !orderId) {
      return res.status(400).json({
        error: "Missing payment information",
        message: "Payment ID and Order ID are required"
      });
    }

    // Check if payment already exists in database
    const existingPayment = await prisma.payment.findFirst({
      where: { 
        OR: [
          { paymentId },
          { orderId }
        ]
      }
    });

    if (existingPayment) {
      // Payment already recorded
      return res.status(200).json({ 
        message: "Payment already recorded",
        payment: existingPayment,
        isNew: false
      });
    }

    // Look for a nomination by email to link payment to
    let linkedNominationId = null;
    if (nomineeEmail) {
      const nomination = await prisma.nomination.findFirst({
        where: { nomineeEmail }
      });
      if (nomination) {
        linkedNominationId = nomination.id;
      }
    }

    // Create payment record regardless of nomination status
    const payment = await prisma.payment.create({
      data: {
        paymentId,
        orderId,
        status: "completed",
        amount: amount || 29900,
        currency: currency || "INR",
        nominationId: linkedNominationId,
      }
    });

    console.log(`Payment recorded successfully: ${paymentId}`);
    return res.status(201).json({
      message: "Payment recorded successfully",
      payment,
      isNew: true
    });
  } catch (error) {
    console.error("Error recording payment:", error);
    return res.status(500).json({
      error: "Failed to record payment",
      message: error.message
    });
  }
};

// Add a new function to verify payment status
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    if (!paymentId) {
      return res.status(400).json({
        error: "Missing payment ID",
        message: "Payment ID is required for verification"
      });
    }

    // Check if payment exists in our database
    const payment = await prisma.payment.findFirst({
      where: { paymentId }
    });

    if (payment) {
      // Payment found in our records
      return res.status(200).json({
        verified: true,
        payment
      });
    }

    // If not in our database, verify with Razorpay API
    try {
      const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
      
      if (paymentDetails && paymentDetails.status === 'captured') {
        // Payment is valid but not in our database yet
        // Create the payment record
        const newPayment = await prisma.payment.create({
          data: {
            paymentId: paymentDetails.id,
            orderId: paymentDetails.order_id,
            status: "completed",
            amount: paymentDetails.amount,
            currency: paymentDetails.currency
          }
        });

        return res.status(200).json({
          verified: true,
          payment: newPayment,
          message: "Payment verified with Razorpay and recorded"
        });
      }
      
      return res.status(200).json({
        verified: false,
        message: "Payment not successfully completed",
        status: paymentDetails.status
      });
      
    } catch (razorpayError) {
      // Error with Razorpay verification
      return res.status(400).json({
        verified: false,
        message: "Could not verify payment with Razorpay",
        error: razorpayError.message
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      error: "Failed to verify payment",
      message: error.message
    });
  }
};

// Add a utility function to reconcile payments with nominations
const reconcilePayments = async (req, res) => {
  try {
    // This endpoint is admin-only
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    const adminCredential = Buffer.from("admin@odishatv.in:Odishatv@password").toString('base64');
    
    if (!token || token !== adminCredential) {
      return res.status(401).json({ 
        error: "Unauthorized",
        message: "Only administrators can access this endpoint" 
      });
    }
    
    // Find all payments without linked nominations
    const unlinkedPayments = await prisma.payment.findMany({
      where: { nominationId: null }
    });
    
    if (unlinkedPayments.length === 0) {
      return res.status(200).json({
        message: "No unlinked payments found",
        unlinkedPaymentsCount: 0
      });
    }
    
    const results = [];
    
    // For each unlinked payment, try to find a matching nomination
    for (const payment of unlinkedPayments) {
      // Check Razorpay for notes that might contain email info
      try {
        const razorpayPayment = await razorpayInstance.payments.fetch(payment.paymentId);
        const email = razorpayPayment.notes?.email || razorpayPayment.email;
        
        if (email) {
          // Try to find nomination by email
          const nomination = await prisma.nomination.findFirst({
            where: { nomineeEmail: email }
          });
          
          if (nomination) {
            // Link the payment to the nomination
            await prisma.payment.update({
              where: { id: payment.id },
              data: { nominationId: nomination.id }
            });
            
            results.push({
              paymentId: payment.paymentId,
              status: "linked",
              nominationId: nomination.id,
              nomineeEmail: email
            });
            continue;
          }
        }
      } catch (razorpayError) {
        console.error(`Error fetching Razorpay payment ${payment.paymentId}:`, razorpayError);
      }
      
      // If we couldn't link it, add to results as unlinked
      results.push({
        paymentId: payment.paymentId,
        status: "unlinked",
        amount: payment.amount,
        currency: payment.currency,
        createdAt: payment.createdAt
      });
    }
    
    return res.status(200).json({
      message: `Found ${unlinkedPayments.length} unlinked payments, reconciled ${results.filter(r => r.status === "linked").length}`,
      results
    });
  } catch (error) {
    console.error("Error reconciling payments:", error);
    return res.status(500).json({
      error: "Failed to reconcile payments",
      message: error.message
    });
  }
};

// Add the missing fetchNominationsWithTotalVotes function
const fetchNominationsWithTotalVotes = async (req, res) => {
  try {
    // Get all nominations with their categories and votes
    const nominations = await prisma.nomination.findMany({
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
        },
        Vote: {
          include: {
            category: true,
          }
        }, // Include the Vote relation with category details
      }
    });

    // Calculate total votes and format the response
    const nominationsWithTotalVotes = nominations.map(nomination => {
      // Extract categories for display
      const categories = nomination.categories.map(cat => ({
        id: cat.category.id,
        name: cat.category.name
      }));
      
      // Create a map to count votes by category
      const votesByCategory = new Map();
      
      // Process all votes for this nominee
      nomination.Vote.forEach(vote => {
        const categoryId = vote.categoryId;
        votesByCategory.set(categoryId, (votesByCategory.get(categoryId) || 0) + 1);
      });
      
      // Sum up all votes across all categories
      const totalVotes = nomination.Vote.length;
      
      // For debugging - log category-wise votes
      console.log(`Nominee: ${nomination.nomineeName}, Total Votes: ${totalVotes}`);
      votesByCategory.forEach((count, categoryId) => {
        const categoryName = nomination.Vote.find(v => v.categoryId === categoryId)?.category?.name || categoryId;
        console.log(`  Category: ${categoryName}, Votes: ${count}`);
      });
      
      // Return formatted nomination with total votes
      return {
        id: nomination.id,
        nomineeName: nomination.nomineeName,
        nomineeEmail: nomination.nomineeEmail,
        nomineePhoto: nomination.nomineePhoto,
        status: nomination.status,
        instagramUrl: nomination.instagramUrl,
        facebookId: nomination.facebookId,
        xId: nomination.xId,
        youtubeId: nomination.youtubeId,
        createdAt: nomination.createdAt,
        categories: categories,
        totalVotes: totalVotes, // Total votes across all categories
        votesByCategory: Array.from(votesByCategory).map(([categoryId, count]) => {
          const category = nomination.Vote.find(v => v.categoryId === categoryId)?.category;
          return {
            categoryId,
            categoryName: category?.name || "Unknown",
            votes: count
          };
        })
      };
    });

    res.status(200).json(nominationsWithTotalVotes);
  } catch (error) {
    console.error("Error fetching nominations with total votes:", error);
    res.status(500).json({ 
      error: "Failed to fetch nominations", 
      message: "There was an error retrieving the nominations with vote counts."
    });
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
  fetchNominationsWithTotalVotes,
  recordPayment,
  verifyPayment,
  reconcilePayments,
};