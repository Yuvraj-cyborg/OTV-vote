import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  fetchNominationsWithVotes,
  approveNominee,
  rejectNominee,
  fetchPhaseState,
} from "../api";
import {
  ChevronDown,
  Menu,
  X,
  Trophy,
  List,
  Grid,
  LogOut,
  Info,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";
import toast from "react-hot-toast";
import NomineeModal from "../components/NomineeModal";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNominations, setFilteredNominations] = useState([]);
  
  // Items per page based on view type
  const ITEMS_PER_PAGE_LIST = 10;
  const ITEMS_PER_PAGE_GRID = 6;

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const isValidAdmin = adminToken === btoa("admin@odishatv.in:Odishatv@password");
    
    if (!isValidAdmin) {
      toast.error("Admin authentication required");
      navigate("/admin-login");
    }
  }, [navigate]);

  // Reset page when view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [isListView]);

  // Filter nominations when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNominations(nominations);
    } else {
      const filtered = nominations.filter(nominee => 
        nominee.nomineeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNominations(filtered);
      setCurrentPage(1); // Reset to first page when searching
    }
  }, [searchTerm, nominations]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchCategories()
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        console.error("❌ Error fetching categories:", error);
      });
  }, []);

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleSearch = async (categoryId) => {
    if (!categoryId) return;
    setLoading(true);
    setCurrentPage(1); // Reset to first page
    setSearchTerm(""); // Clear search term when changing category
    try {
      const response = await fetchNominationsWithVotes(categoryId);
      const processedNominations = Array.isArray(response) ? response.map(nom => ({
        ...nom,
        categoryName: getCategoryNameById(categoryId),
        categories: [getCategoryNameById(categoryId)]
      })) : [];
      setNominations(processedNominations);
      setFilteredNominations(processedNominations);
      setSelectedCategoryName(getCategoryNameById(categoryId));
      setViewAll(false);
    } catch (error) {
      console.error("❌ Error fetching nominations:", error);
      setNominations([]);
      setFilteredNominations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = async () => {
    setLoading(true);
    setCurrentPage(1); // Reset to first page
    setSearchTerm(""); // Clear search term when viewing all
    try {
      const allResponses = await Promise.all(
        categories.map(category => 
          fetchNominationsWithVotes(category.id)
            .then(response => 
              Array.isArray(response) 
                ? response.map(nom => ({
                    ...nom,
                    categoryName: category.name,
                    categories: [category.name],
                    categoryVotes: { [category.id]: nom.votes || 0 } // Store votes by category ID
                  }))
                : []
            )
        )
      );
      
      const allNominations = allResponses.flat();
      const uniqueNominations = allNominations.reduce((acc, current) => {
        const existing = acc.find(item => item.id === current.id);
        if (!existing) {
          return [...acc, {
            ...current,
            totalVotes: current.votes || 0, // Initialize totalVotes
            categoryVotes: current.categoryVotes || {} // Initialize categoryVotes
          }];
        } else {
          // Sum up votes from all categories for this nominee
          const updatedCategoryVotes = {
            ...existing.categoryVotes,
            ...current.categoryVotes
          };
          
          // Calculate total votes across all categories
          const totalVotes = Object.values(updatedCategoryVotes).reduce((sum, votes) => sum + votes, 0);
          
          return acc.map(item => 
            item.id === current.id 
              ? { 
                  ...item, 
                  categories: [...new Set([...item.categories, ...current.categories])],
                  categoryVotes: updatedCategoryVotes,
                  totalVotes: totalVotes, // Store the cumulative votes
                  votes: totalVotes // Also update the votes property for compatibility
                } 
              : item
          );
        }
      }, []);

      setNominations(uniqueNominations);
      setFilteredNominations(uniqueNominations);
      setSelectedCategory("");
      setSelectedCategoryName("All Categories");
      setViewAll(true);
    } catch (error) {
      console.error("❌ Error fetching all nominations:", error);
      setNominations([]);
      setFilteredNominations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveNominee(id);
      setNominations(nominations.map(n => 
        n.id === id ? { ...n, status: "approved" } : n
      ));
      setFilteredNominations(filteredNominations.map(n => 
        n.id === id ? { ...n, status: "approved" } : n
      ));
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error(`Failed to approve nominee: ${error.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectNominee(id);
      setNominations(nominations.map(n => 
        n.id === id ? { ...n, status: "rejected" } : n
      ));
      setFilteredNominations(filteredNominations.map(n => 
        n.id === id ? { ...n, status: "rejected" } : n
      ));
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error(`Failed to reject nominee: ${error.message}`);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const sortedNominations = [...filteredNominations].sort((a, b) => {
    if (sortBy === "name") {
      return a.nomineeName.localeCompare(b.nomineeName);
    } else if (sortBy === "votes") {
      return (b.votes || 0) - (a.votes || 0);
    }
    else if (sortBy === "pending") { 
      return a.status === "pending" ? -1 : b.status === "pending" ? 1 : 0;
    }
    return 0;
  });

  // Pagination logic
  const itemsPerPage = isListView ? ITEMS_PER_PAGE_LIST : ITEMS_PER_PAGE_GRID;
  const totalPages = Math.ceil(sortedNominations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNominations = sortedNominations.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="min-h-screen bg-black/90 backdrop-blur-md flex flex-col md:flex-row mt-16">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-4 right-4 z-40 p-2 bg-black/80 rounded-lg border border-gray-700"
        >
          {mobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>

        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-black/90 p-4 pt-20 overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={handleViewAll}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  viewAll
                    ? "bg-[#ffb700]/10 text-[#ffb700]"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                All Nominations
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    handleSearch(category.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    selectedCategory === category.id && !viewAll
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

        <div className="hidden md:block w-64 bg-black/80 border-r border-gray-800 p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
          <div className="space-y-2">
            <button
              onClick={handleViewAll}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                viewAll
                  ? "bg-[#ffb700]/10 text-[#ffb700]"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              All Nominations
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  handleSearch(category.id);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedCategory === category.id && !viewAll
                    ? "bg-[#ffb700]/10 text-[#ffb700]"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm md:text-base">
                  {viewAll ? "Viewing all nominations" : selectedCategoryName ? `Viewing: ${selectedCategoryName}` : "Manage nominations"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search nominees by name..."
                  className="w-full px-4 py-2 pl-10 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  Found {filteredNominations.length} nominees matching "{searchTerm}"
                </p>
              )}
            </div>

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
                  <option value="pending">pending</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-400">Loading nominations...</p>
            ) : (
              <>
                <div className={isListView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"}>
                  {isListView && currentNominations.length > 0 && !isMobile && (
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
                  
                  {currentNominations.length > 0 ? (
                    currentNominations.map((nominee) => (
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
                                </div>
                                {!isMobile && (
                                  <div className="flex flex-wrap gap-1 items-center">
                                    {nominee.categories?.slice(0, 3).map((category, i) => (
                                      <span 
                                        key={i}
                                        className="inline-block px-2 py-0.5 text-xs rounded-full bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/20"
                                      >
                                        {category}
                                      </span>
                                    ))}
                                    {nominee.categories?.length > 3 && (
                                      <span className="text-xs text-gray-400">+{nominee.categories.length - 3}</span>
                                    )}
                                  </div>
                                )}
                                <div className="text-center">
                                  <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-gray-800 rounded-md font-bold text-sm md:text-lg text-[#ffb700]">
                                    {viewAll && nominee.totalVotes !== undefined ? nominee.totalVotes : nominee.votes || 0}
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
                              <button 
                                onClick={() => {
                                  setSelectedNominee(nominee);
                                  window.scrollTo(0, 0);
                                }}
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-[#ffb700]/20"
                              >
                                <Info className="w-4 h-4 text-white" />
                              </button>
                              <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                                <h3 className="font-bold text-white text-sm md:text-base">{nominee.nomineeName}</h3>
                                <p className="text-xs md:text-sm text-white/90">
                                  {nominee.categories?.slice(0, 2).join(", ")}
                                  {nominee.categories?.length > 2 && "..."}
                                </p>
                                <p className="text-xs md:text-sm text-white/90 mt-1">Votes: {viewAll && nominee.totalVotes !== undefined ? nominee.totalVotes : nominee.votes || 0}</p>
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
                  ) : searchTerm ? (
                    <p className="text-gray-400 text-center col-span-full py-8">
                      No nominations found matching "{searchTerm}"
                    </p>
                  ) : (
                    <p className="text-gray-400 text-center col-span-full py-8">
                      {viewAll ? "No nominations found across all categories" : "No nominations found for this category"}
                    </p>
                  )}
                </div>

                {/* Pagination controls - only show if not searching or search has multiple pages */}
                {sortedNominations.length > 0 && totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="text-gray-300 text-sm">
                      Page <span className="font-bold text-[#ffb700]">{currentPage}</span> of{" "}
                      <span className="font-bold">{totalPages}</span>
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedNominee && (
        <NomineeModal 
          nominee={selectedNominee} 
          onClose={() => setSelectedNominee(null)}
          viewAll={viewAll}
        />
      )}
    </>
  );
}