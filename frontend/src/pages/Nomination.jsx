import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitNomination, fetchCategories, createRazorpayOrder, fetchRazorpayKey, fetchUserProfile } from "../api";
import { Camera, Instagram, Facebook, Twitter, Youtube, User, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const LoadingPage = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-12 w-12 text-[#ffb700] animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Please wait</h2>
        <p className="text-gray-300">{message}</p>
        <div className="flex justify-center mt-4 space-x-1">
          <div className="h-2 w-2 bg-[#ffb700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-[#e50914] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-[#ff5e00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

const NominationPage = () => {
  const navigate = useNavigate();
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookId, setFacebookId] = useState("");
  const [xId, setXId] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Check if user is logged in and get profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit a nomination");
      navigate("/login", { state: { returnUrl: "/nominate" } });
    } else {
      setIsAuthenticated(true);
      
      // Get the user profile to get their email
      fetchUserProfile()
        .then(response => {
          const profileData = response.data;
          console.log("User profile loaded:", profileData);
          setUserProfile(profileData);
          setNomineeEmail(profileData.userId);
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to load your profile");
        });
    }
  }, [navigate]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    }
    
    if (isAuthenticated) {
      loadCategories();

      fetchRazorpayKey()
        .then((key) => {
          setRazorpayKey(key);
        })
        .catch((error) => {
          console.error("Error fetching Razorpay key:", error);
          toast.error("Failed to load payment gateway");
        });
    }
  }, [isAuthenticated]);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    if (e.target.checked) {
      if (selectedCategories.length >= 3) {
        toast.error("You can only select up to 3 categories");
        return;
      }
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  // Handle payment
  const handlePayment = async (nominationData) => {
    setIsProcessingPayment(true);
    try {
      console.log("Creating order...");
      
      // Create a Razorpay order - this should include the token in the request headers
      const order = await createRazorpayOrder();
      console.log("Order created:", order);
  
      // Configure Razorpay options
      const options = {
        key: razorpayKey, 
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "OTV Vote Nomination",
        description: "Payment for influencer nomination (₹1)",
        image: "https://otv-vote.onrender.com/logo.png", // Optional: Add your logo
        handler: async (response) => {
          try {
            console.log("Payment successful. Submitting nomination...");
            toast.success("Payment successful!");
            
            // Now submit the nomination with payment details
            await submitNomination({
              ...nominationData,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
            
            toast.success("Nomination submitted successfully!");
            navigate("/nomination-success");
          } catch (error) {
            console.error("Error submitting nomination:", error);
            toast.error("Payment was successful, but submission failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: nominationData.nomineeName,
          email: userProfile?.userId || "",
          contact: "" // Optional: Add phone number if available
        },
        theme: {
          color: "#ffb700",
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
            toast.error("Payment cancelled. Please try again.");
          }
        }
      };
  
      // Initialize Razorpay
      const rzp = new window.Razorpay(options);
      
      // Handle Razorpay internal errors
      rzp.on('payment.failed', function(response) {
        setIsProcessingPayment(false);
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      
      // Open Razorpay payment dialog
      rzp.open();
    } catch (error) {
      console.error("Error in payment process:", error);
      setIsProcessingPayment(false);
      
      // Show appropriate error message
      if (error.response?.status === 401) {
        toast.error("Authentication error. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login", { state: { returnUrl: "/nominate" } });
      } else {
        toast.error("Payment initialization failed. Please try again.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      toast.error("Please upload a photo for your nomination");
      return;
    }

    if (!instagramUrl && !facebookId && !xId && !youtubeId) {
      toast.error("Please provide at least one social media handle");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    if (selectedCategories.length > 3) {
      toast.error("You can select maximum 3 categories");
      return;
    }

    const nominationData = {
      nomineeName,
      nomineeEmail,
      instagramUrl,
      facebookId,
      xId,
      youtubeId,
      categoryIds: selectedCategories,
      photo
    };

    try {
      await handlePayment(nominationData);
    } catch (error) {
      console.error("Error in nomination submission:", error);
      toast.error("Failed to submit nomination. Please try again.");
    }
  };

  // If not authenticated, don't render the form at all
  if (!isAuthenticated) {
    return <LoadingPage message="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      {isProcessingPayment && <LoadingPage message="Confirming your payment..." />}
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center">Submit Your Nomination</h1>
          <p className="text-gray-300 mb-12 text-center">
            Nominate yourself or your agency for the Influencer Awards 2025. You can select up to 3 categories.
          </p>

          <div className="glass-card bg-gray-800 rounded-xl border border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                    placeholder="Enter full name"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    disabled
                    value={nomineeEmail}
                    className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] opacity-70"
                    placeholder={nomineeEmail || "Loading your email address..."}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-400">Your nomination will use your account email</p>
              </div>

              {/* Social Media Handles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-white mb-2">Instagram</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="Username"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Instagram className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-white mb-2">Facebook</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      value={facebookId}
                      onChange={(e) => setFacebookId(e.target.value)}
                      className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="Username"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Facebook className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="xId" className="block text-sm font-medium text-white mb-2">X (Twitter)</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="xId"
                      name="xId"
                      value={xId}
                      onChange={(e) => setXId(e.target.value)}
                      className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="Username"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Twitter className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium text-white mb-2">YouTube</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="youtube"
                      name="youtube"
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="Channel Name"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Youtube className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Select Categories (Max 3)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={handleCategoryChange}
                        className="mr-2 h-4 w-4 text-[#ffb700] focus:ring-[#ffb700] border-gray-600 rounded"
                        disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category.id)}
                      />
                      <span className="text-gray-300">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Profile Image</label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhoto(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <span className="sr-only">Remove image</span>
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="flex text-sm text-gray-400">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#ffb700] hover:text-[#ffa600]"
                          >
                            <span>Upload a photo</span>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 512KB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="text-center py-4">
                <p className="text-lg font-medium text-white">Payment Amount: <span className="text-[#ffb700]">₹1</span></p>
                <p className="text-sm text-gray-400 mt-1">Nomination fee to verify your submission</p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-[#ffb700] text-black rounded-lg font-bold hover:bg-[#ffa600] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Payment (₹1)"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NominationPage;