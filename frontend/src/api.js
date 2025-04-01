import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api"; // Default to localhost if not set
// const API_URL = "https://otv-vote.onrender.com/api";
// const API_URL = "http://localhost:5000/api";


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

export const createRazorpayOrder = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/nominations/create-order`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

export const submitNomination = async (nominationData) => {
  const formData = new FormData();
  formData.append("nomineeName", nominationData.nomineeName);
  formData.append("nomineeEmail", nominationData.nomineeEmail);
  formData.append("instagramUrl", nominationData.instagramUrl);
  formData.append("facebookId", nominationData.facebookId);
  formData.append("xId", nominationData.xId);
  formData.append("youtubeId", nominationData.youtubeId);
  formData.append("categoryIds", JSON.stringify(nominationData.categoryIds)); // Ensure this is an array
  formData.append("paymentId", nominationData.paymentId);
  formData.append("orderId", nominationData.orderId);

  if (nominationData.photo) {
    formData.append("nomineePhoto", nominationData.photo);
  }

  try {
    const response = await axios.post(`${API_URL}/nominations/nominate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting nomination:", error);
    throw error;
  }
};
export const approveNominee = async (id) => {
  return await axios.post(`${API_URL}/nominations/${id}/approve`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
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
    return response.data.phase; // Returns "nomination" or "voting"
  } catch (error) {
    console.error("Error fetching phase state:", error.response?.data || error.message);
    throw error;
  }
};


export const togglePhaseState = async () => {
  try {
    const response = await axios.post(`${API_URL}/phase/toggle`);
    return response.data.phase; // Returns the updated phase
  } catch (error) {
    console.error("Error toggling phase:", error.response?.data || error.message);
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