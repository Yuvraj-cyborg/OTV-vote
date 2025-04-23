import { useEffect, useState } from "react";
import { fetchCategories, fetchNominations, submitVote } from "../api";
import { ChevronDown, Search, Trophy, Instagram, Facebook, Twitter, Youtube, Loader, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import sponsors from "../sponsors";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [votingIds, setVotingIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        toast.error("Failed to load categories");
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!selectedCategory) {
      toast("Please select a category first!", {
        icon: "⚠️",
        style: {
          background: "#ffb700",
          color: "#000",
        },
      });
      return;
    }
    setLoading(true);
    try {
      const nomineesData = await fetchNominations(selectedCategory.id);
      setNominees(nomineesData.filter((n) => n.status === "approved"));
      if (nomineesData.length === 0) {
        toast("No nominees found for this category", {
          icon: "ℹ️",
        });
      }
    } catch (error) {
      console.error("Error fetching nominees:", error);
      setNominees([]);
      toast.error("Failed to load nominees");
    }
    setLoading(false);
  };

  const handleVote = async (nomineeId) => {
    if (!selectedCategory) {
      toast("Please select a category first!", {
        icon: "⚠️",
        style: {
          background: "#ffb700",
          color: "#000",
        },
        duration: 2000,
      });
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to vote", {
        duration: 2000,
      });
      navigate("/login");
      return;
    }

    // Show immediate loading state
    setVotingIds(prev => [...prev, nomineeId]);
    
    // Show immediate toast
    const toastId = toast.loading("Submitting your vote...");

    try {
      const response = await submitVote({ nominationId: nomineeId, categoryId: selectedCategory.id });

      // Update the loading toast
      if (response.data.warning) {
        toast.dismiss(toastId);
        toast(response.data.warning, {
          icon: "⚠️",
          style: {
            background: "#ffb700",
            color: "#000",
          },
          duration: 2000,
        });
      } else {
        toast.dismiss(toastId);
        toast.success("Vote submitted successfully!", {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error submitting vote:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to submit vote.", {
        duration: 2000,
      });
    } finally {
      // Remove loading state
      setVotingIds(prev => prev.filter(id => id !== nomineeId));
    }
  };

  const filteredNominees = nominees.filter((nominee) =>
    nominee.nomineeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 ] mt-8">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center">
            Vote for Excellence
          </h1>
          <p className="text-gray-300 mb-12 text-center">
            Cast your vote for the best influencers, agencies, and campaigns in each category. You can vote once per
            category.
          </p>
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 mb-12">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-64 px-4 h-10 bg-gray-800 rounded-lg text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <span className="text-white truncate overflow-hidden">
                  {selectedCategory ? selectedCategory.name : "Select Category"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg py-1 max-h-52 overflow-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 text-white"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 h-10 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 h-10 bg-[#ffb700] text-black rounded-lg hover:bg-[#ffa600] transition-colors flex items-center justify-center"
            >
              Search
            </button>
          </div>

          {loading && <p className="text-center text-gray-400">Loading nominees...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNominees.map((nominee) => (
              <div key={nominee.id} className="glass-card bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="relative h-94 bg-gray-700">
                  <img
                    src={nominee.nomineePhoto || "https://via.placeholder.com/300"}
                    alt={nominee.nomineeName}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{nominee.nomineeName}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex space-x-3 mb-3">
                    {nominee.instagramUrl && (
                      <a
                        href={`https://instagram.com/${nominee.instagramUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#ffb700]"
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {nominee.facebookId && (
                      <a
                        href={`https://facebook.com/${nominee.facebookId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#ffb700]"
                      >
                        <Facebook size={18} />
                      </a>
                    )}
                    {nominee.xId && (
                      <a
                        href={`https://twitter.com/${nominee.xId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#ffb700]"
                      >
                        <Twitter size={18} />
                      </a>
                    )}
                    {nominee.youtubeId && (
                      <a
                        href={`https://youtube.com/${nominee.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#ffb700]"
                      >
                        <Youtube size={18} />
                      </a>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleVote(nominee.id)}
                      disabled={votingIds.includes(nominee.id)}
                      className={`px-3 py-1 bg-[#ffb700] text-black rounded-lg hover:bg-[#ffa600] flex items-center justify-center ${
                        votingIds.includes(nominee.id) ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {votingIds.includes(nominee.id) ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          <span className="ml-2 font-medium text-sm">Voting...</span>
                        </>
                      ) : (
                        <>
                          <Trophy className="w-3.5 h-3.5" />
                          <span className="ml-2 font-medium text-sm">Vote</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* --- Sponsors Section (Conditional) --- */}
          {!selectedCategory && (
            <section className="my-16">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">Our Sponsors</h2>
              
              {/* Platinum Sponsors */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white text-center mb-8">Platinum Sponsors</h3>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {sponsors
                    .filter((sponsor) => sponsor.tier === "platinum")
                    .map((sponsor) => (
                      <a
                        key={sponsor.id}
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 p-6 rounded-xl flex flex-col items-center transition-transform hover:scale-105 w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-xs border border-yellow-500 shadow-lg shadow-yellow-500/10"
                      >
                        <div className="relative w-full h-36 mb-4">
                          <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2 text-center">{sponsor.name}</h4>
                        <div className="flex items-center text-[#ffb700] text-sm">
                          Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                        </div>
                      </a>
                    ))}
                </div>
              </div>

              {/* Silver Sponsors */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white text-center mb-8">Silver Sponsors</h3>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {sponsors
                    .filter((sponsor) => sponsor.tier === "silver")
                    .map((sponsor) => (
                      <a
                        key={sponsor.id}
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 p-6 rounded-xl flex flex-col items-center transition-transform hover:scale-105 w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-xs border border-gray-600 shadow-lg shadow-gray-500/10"
                      >
                        <div className="relative w-full h-32 mb-4">
                          <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2 text-center">{sponsor.name}</h4>
                        <div className="flex items-center text-[#ffb700] text-sm">
                          Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                        </div>
                      </a>
                    ))}
                </div>
              </div>

              {/* Event Partners */}
              <div>
                <h3 className="text-xl font-bold text-white text-center mb-8">Event Partners</h3>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {sponsors
                    .filter((sponsor) => sponsor.tier === "eventPartner")
                    .map((sponsor) => (
                      <a
                        key={sponsor.id}
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 p-6 rounded-xl flex flex-col items-center transition-transform hover:scale-105 w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-xs border border-blue-500 shadow-lg shadow-blue-500/10"
                      >
                        <div className="relative w-full h-32 mb-4">
                          <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2 text-center">{sponsor.name}</h4>
                        <div className="flex items-center text-[#ffb700] text-sm">
                          Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            </section>
          )}
          {/* --- End Sponsors Section --- */}
        </div>
      </div>
    </div>);
}