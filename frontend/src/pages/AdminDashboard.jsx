import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  fetchNominationsWithVotes,
  approveNominee,
  rejectNominee,
  fetchPhaseState,
  togglePhaseState,
} from "../api";
import {
  ChevronDown,
  Menu,
  X,
  Trophy,
  ToggleLeft,
  ToggleRight,
  List,
  Grid,
} from "lucide-react";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVotingPhase, setIsVotingPhase] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch categories and phase state on component mount
  useEffect(() => {
    const getPhase = async () => {
      try {
        const phase = await fetchPhaseState();
        setIsVotingPhase(phase === "voting");
      } catch (error) {
        console.error("Error fetching phase:", error);
      }
    };
    getPhase();

    fetchCategories()
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        console.error("❌ Error fetching categories:", error);
      });
  }, []);

  // Toggle the phase between nomination and voting
  const handlePhaseToggle = async () => {
    try {
      const phase = await togglePhaseState();
      setIsVotingPhase(phase === "voting");
    } catch (error) {
      console.error("Error toggling phase:", error);
    }
  };

  // Fetch nominations for the selected category
  const handleSearch = async (categoryId) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const response = await fetchNominationsWithVotes(categoryId);
      setNominations(Array.isArray(response) ? response : []);
      setSelectedCategoryName(getCategoryNameById(categoryId));
    } catch (error) {
      console.error("❌ Error fetching nominations:", error);
      setNominations([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Handle approve/reject actions
  const handleApprove = async (id) => {
    try {
      await approveNominee(id);
      setNominations(nominations.map((n) => (n.id === id ? { ...n, status: "approved" } : n)));
    } catch (error) {
      console.error("Error approving nominee:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectNominee(id);
      setNominations(nominations.map((n) => (n.id === id ? { ...n, status: "rejected" } : n)));
    } catch (error) {
      console.error("Error rejecting nominee:", error);
    }
  };

  // Sort nominations by name or votes
  const sortedNominations = [...nominations].sort((a, b) => {
    if (sortBy === "name") {
      return a.nomineeName.localeCompare(b.nomineeName);
    } else if (sortBy === "votes") {
      return (b.votes || 0) - (a.votes || 0);
    }
    return 0;
  });

    return (
      <div className="min-h-screen bg-black/90 backdrop-blur-md flex flex-col md:flex-row mt-16">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-4 right-4 z-50 p-2 bg-black/80 rounded-lg border border-gray-700"
        >
          {mobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>
  
        {/* Side Panel for Categories - Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/90 p-4 pt-20 overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    handleSearch(category.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    selectedCategory === category.id
                      ? "bg-[#ffb700]/10 text-[#ffb700]"
                      : "text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
  
        {/* Side Panel for Categories - Desktop */}
        <div className="hidden md:block w-64 bg-black/80 border-r border-gray-800 p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  handleSearch(category.id);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedCategory === category.id
                    ? "bg-[#ffb700]/10 text-[#ffb700]"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm md:text-base">Manage nominations and track voting progress</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs md:text-sm font-medium ${isVotingPhase ? "text-gray-500" : "text-[#ffb700]"}`}>
                  Nomination
                </span>
                <button
                  onClick={handlePhaseToggle}
                  className="relative inline-flex h-5 w-10 items-center flex-shrink-0 cursor-pointer"
                >
                  {isVotingPhase ? (
                    <ToggleRight className="h-7 w-9 md:h-8 md:w-11 text-[#ffb700]" />
                  ) : (
                    <ToggleLeft className="h-7 w-9 md:h-8 md:w-11 text-gray-400" />
                  )}
                </button>
                <span className={`text-xs md:text-sm font-medium ${isVotingPhase ? "text-[#ffb700]" : "text-gray-500"}`}>
                  Voting
                </span>
              </div>
            </div>
  
            {/* View Toggle and Sort Options */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsListView(false)}
                  className={`p-2 rounded-lg ${
                    !isListView ? "bg-[#ffb700]/10 text-[#ffb700]" : "text-gray-500 hover:bg-gray-700/50"
                  }`}
                >
                  <Grid className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setIsListView(true)}
                  className={`p-2 rounded-lg ${
                    isListView ? "bg-[#ffb700]/10 text-[#ffb700]" : "text-gray-500 hover:bg-gray-700/50"
                  }`}
                >
                  <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs md:text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 md:px-4 md:py-2 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700] text-sm md:text-base"
                >
                  <option value="name">Name</option>
                  <option value="votes">Votes</option>
                </select>
              </div>
            </div>
  
            {/* Nominations List */}
            {loading ? (
              <p className="text-center text-gray-400">Loading nominations...</p>
            ) : (
              <div className={isListView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"}>
                {isListView && sortedNominations.length > 0 && !isMobile && (
                  <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 md:p-4 hidden sm:flex items-center">
                    <div className="w-10 md:w-12 flex-shrink-0"></div>
                    <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="font-semibold text-[#ffb700] text-sm md:text-base">Name</div>
                      {!isMobile && (
                        <div className="font-semibold text-[#ffb700] text-sm md:text-base">Categories</div>
                      )}
                      <div className="font-semibold text-[#ffb700] text-sm md:text-base text-center">Votes</div>
                      <div className="font-semibold text-[#ffb700] text-sm md:text-base text-right">Status</div>
                    </div>
                  </div>
                )}
                
                {sortedNominations.length > 0 ? (
                  sortedNominations.map((nominee) => (
                    <div
                      key={nominee.id}
                      className={`bg-black/50 rounded-lg border border-gray-700 ${
                        isListView ? "flex items-center p-3 md:p-4" : "overflow-hidden"
                      }`}
                    >
                      <div className={isListView ? "flex items-center gap-3 md:gap-4 w-full" : "aspect-square relative"}>
                        {isListView ? (
                          <>
                            <img
                              src={nominee.nomineePhoto || "https://via.placeholder.com/150"}
                              alt={nominee.nomineeName}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 items-center">
                              <div>
                                <h3 className="font-bold text-white text-sm md:text-base">{nominee.nomineeName}</h3>
                                <p className="text-xs text-gray-400">{selectedCategoryName}</p>
                              </div>
                              {!isMobile && (
                                <div className="flex flex-wrap gap-1 items-center">
                                  {categories
                                    .filter(cat => cat.id !== selectedCategory)
                                    .slice(0, 2)
                                    .map((category) => (
                                      <span 
                                        key={category.id}
                                        className="inline-block px-2 py-0.5 text-xs rounded-full bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/20"
                                      >
                                        {category.name}
                                      </span>
                                    ))}
                                </div>
                              )}
                              <div className="text-center">
                                <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-gray-800 rounded-md font-bold text-sm md:text-lg text-[#ffb700]">
                                  {nominee.votes || 0}
                                </span>
                              </div>
                              <div className="text-right">
                                {nominee.status === "pending" ? (
                                  <div className="flex gap-1 md:gap-2 justify-end">
                                    <button
                                      onClick={() => handleApprove(nominee.id)}
                                      className="px-2 py-0.5 md:px-3 md:py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs md:text-sm"
                                    >
                                      {isMobile ? '✓' : 'Approve'}
                                    </button>
                                    <button
                                      onClick={() => handleReject(nominee.id)}
                                      className="px-2 py-0.5 md:px-3 md:py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs md:text-sm"
                                    >
                                      {isMobile ? '✕' : 'Reject'}
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    className={`inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm ${
                                      nominee.status === "approved"
                                        ? "bg-green-500/20 text-green-500"
                                        : "bg-red-500/20 text-red-500"
                                    }`}
                                  >
                                    {isMobile 
                                      ? nominee.status.charAt(0).toUpperCase() 
                                      : nominee.status.charAt(0).toUpperCase() + nominee.status.slice(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={nominee.nomineePhoto || "https://via.placeholder.com/150"}
                              alt={nominee.nomineeName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                              <h3 className="font-bold text-white text-sm md:text-base">{nominee.nomineeName}</h3>
                              <p className="text-xs md:text-sm text-white/90">{selectedCategoryName}</p>
                              {isVotingPhase && (
                                <p className="text-xs md:text-sm text-white/90 mt-1">Votes: {nominee.votes || 0}</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {!isListView && (
                        <div className="p-3 md:p-4">
                          {nominee.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(nominee.id)}
                                className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs md:text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(nominee.id)}
                                className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs md:text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm ${
                                nominee.status === "approved"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              }`}
                            >
                              {nominee.status.charAt(0).toUpperCase() + nominee.status.slice(1)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center col-span-full py-8">No nominations found for this category.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }