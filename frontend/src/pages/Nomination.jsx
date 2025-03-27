import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { submitNomination, fetchCategories, createRazorpayOrder, fetchRazorpayKey } from "../api";
import { Camera, Instagram, Facebook, Twitter, Youtube, User, Mail } from "lucide-react";
import toast from "react-hot-toast";

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
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState("");

  // Fetch categories and Razorpay key
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
    loadCategories();

    fetchRazorpayKey()
      .then((key) => {
        setRazorpayKey(key);
      })
      .catch((error) => {
        console.error("Error fetching Razorpay key:", error);
        toast.error("Failed to load payment gateway");
      });
  }, []);

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
    try {
      const amount = 100; // ₹1 in paise
      const order = await createRazorpayOrder({
        amount: amount,
        currency: "INR",
        receipt: `nomination_${Date.now()}`,
      });

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Nomination Payment",
        description: "Payment for nomination submission",
        handler: async (response) => {
          try {
            const submissionResponse = await submitNomination({
              ...nominationData,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
            toast.success("Nomination submitted successfully!");
            navigate("/nomination-success");
          } catch (error) {
            console.error("Error submitting nomination:", error);
            toast.error("Submission failed. Please contact support.");
          }
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
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!instagramUrl && !facebookId && !xId && !youtubeId) {
      toast.error("Please provide at least one social media handle");
      return;
    }

    if (!photo || selectedCategories.length === 0) {
      toast.error("Please upload a photo and select at least one category");
      return;
    }

    if (selectedCategories.length > 3) {
      toast.error("You can select maximum 3 categories");
      return;
    }

    setLoading(true);
    const nominationData = {
      nomineeName,
      nomineeEmail,
      instagramUrl,
      facebookId,
      xId,
      youtubeId,
      categoryIds: selectedCategories,
      photo,
    };

    await handlePayment(nominationData);
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
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
                    className="w-full px-[6vh] py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
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
                    required
                    value={nomineeEmail}
                    onChange={(e) => setNomineeEmail(e.target.value)}
                    className="w-full px-[6vh] py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
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
                      className="w-full px-[6vh] py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="@username"
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
                      className="w-full px-[6vh] py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="Facebook ID"
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
                      className="w-full px-[6vh] py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="@username"
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
                      className="w-full px-[6vh] py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                      placeholder="Channel ID"
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
                        className="mr-2"
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
              <div>
                <p className="text-sm font-medium text-white">Payment Amount: ₹1</p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-[#ffb700] text-black rounded-lg font-bold hover:bg-[#ffa600] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Proceed to Payment (₹1)"}
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