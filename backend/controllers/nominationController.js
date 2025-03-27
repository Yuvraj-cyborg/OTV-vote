const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
const Razorpay = require("razorpay"); // Use `Razorpay` instead of `razorpay` to avoid conflict
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

const createNomination = async (req, res) => {
  try {
    console.log("Received nomination request:", req.body);
    console.log("Received file:", req.file);

    const { nomineeName, nomineeEmail, instagramUrl, facebookId, xId, youtubeId, categoryIds, paymentId, orderId } = req.body;
    const nomineePhotoFile = req.file;

    // Validate at least one platform ID is provided
    if (!instagramUrl && !facebookId && !xId && !youtubeId) {
      return res.status(400).json({ error: "Please provide at least one platform ID (Instagram, Facebook, X, or YouTube)." });
    }

    if (!nomineeName || !nomineeEmail || !categoryIds) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure categoryIds is an array
    const parsedCategoryIds = Array.isArray(categoryIds) ? categoryIds : JSON.parse(categoryIds);

    let nomineePhotoUrl = null;

    if (nomineePhotoFile) {
      const sanitizedEmail = nomineeEmail.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `nominations/${sanitizedEmail}/${Date.now()}-${nomineePhotoFile.originalname}`;

      const { data, error } = await supabase.storage
        .from("nominees-photos")
        .upload(fileName, nomineePhotoFile.buffer, {
          contentType: nomineePhotoFile.mimetype,
        });

      if (error) {
        console.error("❌ Supabase Upload Error:", error);
        return res.status(500).json({ error: "File upload failed" });
      }

      nomineePhotoUrl = supabase.storage.from("nominees-photos").getPublicUrl(data.path).data.publicUrl;
      console.log("✅ Generated Public URL:", nomineePhotoUrl);
    }

    let nomination = await prisma.nomination.findFirst({
      where: { nomineeEmail },
      include: { categories: true },
    });

    if (!nomination) {
      nomination = await prisma.nomination.create({
        data: {
          nomineeName,
          nomineeEmail,
          nomineePhoto: nomineePhotoUrl,
          instagramUrl,
          facebookId,
          xId,
          youtubeId,
          categories: { create: parsedCategoryIds.map(id => ({ category: { connect: { id: parseInt(id) } }})) },
          payments: {
            create: {
              paymentId,
              orderId,
              status: "captured",
              amount: 1, // ₹1
              currency: "INR",
            },
          },
        },
        include: { categories: true, payments: true },
      });
    } else {
      const existingCategoryIds = nomination.categories.map(c => c.categoryId);
      const newCategoryIds = parsedCategoryIds.filter(id => !existingCategoryIds.includes(parseInt(id)));

      if (newCategoryIds.length === 0) {
        return res.status(400).json({ error: "Nominee already exists in all selected categories." });
      }

      await prisma.nominationCategory.createMany({
        data: newCategoryIds.map(id => ({ nominationId: nomination.id, categoryId: parseInt(id) })),
      });

      await prisma.payment.create({
        data: {
          paymentId,
          orderId,
          status: "captured",
          amount: 1, // ₹1
          currency: "INR",
          nominationId: nomination.id,
        },
      });
    }

    console.log("✅ Nomination saved in DB:", nomination);
    res.status(201).json({ message: "Nomination submitted successfully", nomination });
  } catch (error) {
    console.error("🔥 Nomination Submission Error:", error);
    res.status(500).json({ error: "Nomination failed" });
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
    // Hardcode the amount to ₹1 (100 paise)
    const amount = 100; // ₹1 in paise (100 paise = ₹1)

    // Create a Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `nomination_${Date.now()}`,
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
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
};