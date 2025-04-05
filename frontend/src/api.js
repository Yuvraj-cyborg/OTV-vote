import axios from "axios";

// const API_URL = "http://localhost:5000/api"; // Default to localhost if not set
const API_URL = import.meta.env.VITE_APP_API_URL;


export const registerUser = async (formData) => {
  return await axios.post(`${API_URL}/auth/register`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/auth/login`, userData);
};

export const fetchPolls = async () => {
  return await axios.get(`${API_URL}/polls`);
};

export const createPoll = async (pollData) => {
  return await axios.post(`${API_URL}/polls`, pollData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const submitVote = async ({ nominationId, categoryId }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  return axios.post(
    `${API_URL}/votes`,
    { nominationId, categoryId }, // Ensure categoryId is included
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  
};


export async function fetchNominationsWithVotes(categoryId) {
  try {
    const [nominationsRes, votesRes] = await Promise.all([
      axios.get(`${API_URL}/nominations?categoryId=${categoryId}`),
      axios.get(`${API_URL}/votes/${categoryId}`)
    ]);

    // Debugging API responses
    console.log("✅ Nominations:", nominationsRes.data);
    console.log("✅ Votes:", votesRes.data);

    const nominations = nominationsRes.data;
    const votes = votesRes.data;

    // Create a vote count map
    const voteMap = new Map(votes.map(v => [v.nominationId, v._count?.nominationId || 0]));

    // Merge votes into nominations
    return nominations.map(nominee => ({
      ...nominee,
      votes: voteMap.get(nominee.id) || 0 // Default to 0 if no votes
    }));

  } catch (error) {
    console.error("❌ Error fetching nominations and votes:", error.response?.data || error.message);
    return [];
  }
}

// Add this to your api.js
export const fetchNominationsByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/nominations/by-email/:email`, {
      params: { email },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nominations by email:", error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  return await axios.get(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    console.log("Fetched categories:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const createRazorpayOrder = async () => {
  try {
    // Get the authentication token
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("You must be logged in to create an order");
    }

    console.log("Creating Razorpay order with token");
    const response = await axios.post(`${API_URL}/nominations/create-order`, {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    
    console.log("Razorpay order created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

export const submitNomination = async (nominationData) => {
  const formData = new FormData();
  formData.append("nomineeName", nominationData.nomineeName);
  formData.append("instagramUrl", nominationData.instagramUrl || "");
  formData.append("facebookId", nominationData.facebookId || "");
  formData.append("xId", nominationData.xId || "");
  formData.append("youtubeId", nominationData.youtubeId || "");
  formData.append("categoryIds", JSON.stringify(nominationData.categoryIds || []));
  formData.append("paymentId", nominationData.paymentId || "");
  formData.append("orderId", nominationData.orderId || "");

  if (nominationData.photo) {
    // Validate file size (512KB = 524288 bytes)
    if (nominationData.photo.size > 524288) {
      throw new Error("Image size exceeds 512KB limit. Please select a smaller image.");
    }
    
    // Validate file type
    if (!nominationData.photo.type.startsWith('image/')) {
      throw new Error("Please upload a valid image file (PNG, JPG).");
    }
    
    console.log(`Including photo in nomination: ${nominationData.photo.name} (${(nominationData.photo.size / 1024).toFixed(2)}KB)`);
    formData.append("nomineePhoto", nominationData.photo);
  } else {
    throw new Error("A photo is required for nomination");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to submit a nomination");
  }

  try {
    console.log("Submitting nomination to:", `${API_URL}/nominations/nominate`);
    const response = await axios.post(`${API_URL}/nominations/nominate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting nomination:", error);
    throw error;
  }
};

export const approveNominee = async (id) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.error("No authentication token found in localStorage");
    throw new Error("You need to be logged in to perform this action");
  }

  try {
    const response = await axios.post(
      `${API_URL}/nominations/${id}/approve`,
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in approveNominee:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    if (error.response?.status === 401) {
      // Clear invalid token and redirect
      localStorage.removeItem("token");
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
    }
    throw error;
  }
};

export const rejectNominee = async (id) => {
  return await axios.post(`${API_URL}/nominations/${id}/reject`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const fetchNominations = async (categoryId) => {
  try {
    console.log("Fetching nominations for category:", categoryId);
    const response = await axios.get(`${API_URL}/nominations`, {
      params: { categoryId },
    });
    console.log("Fetched nominations:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching nominations:", error);
    return [];
  }
};

export const fetchApprovedNominees = async () => {
  try {
    const response = await axios.get(`${API_URL}/nominations/approved`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approved nominations:", error);
    return [];
  }
};

/**
 * Send OTP to the user's email
 * @param {Object} data - Contains email and name
 * @returns {Promise} - Axios response
 */
export const sendOTP = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-otp`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchProfileDetails = async () => {
  return await axios.get(`${API_URL}/auth/profileDetails`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export const fetchPhaseState = async () => {
  try {
    const response = await axios.get(`${API_URL}/phase`);
    console.log('Phase state:', response.data);
    return response.data.phase;
  } catch (error) {
    console.error('Error fetching phase state:', error.response?.data || error.message);
    return 'nomination'; // Default to nomination phase if there's an error
  }
};

export const togglePhaseState = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      throw new Error("Admin authentication required");
    }

    const response = await axios.post(`${API_URL}/phase/toggle`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Phase toggled:', response.data);
    return response.data.phase;
  } catch (error) {
    console.error('Error toggling phase state:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchRazorpayKey = async () => {
  try {
    const response = await axios.get(`${API_URL}/nominations/razorpay-key`);
    return response.data.key;
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    throw error;
  }
};

export const loginWithGoogle = async (googleData) => {
  return axios.post(`${API_URL}/auth/google`, {
    token: googleData.credential,
    email: googleData.email,
    name: googleData.name,
    picture: googleData.picture
  });
};

export const fetchUserNominations = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    console.log("Fetching user nominations from endpoint");
    const response = await axios.get(`${API_URL}/nominations/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("User nominations response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user nominations:", error);
    if (error.response?.status === 401) {
      console.error("User not authenticated");
      // localStorage.removeItem("token");
    }
    return [];
  }
};
