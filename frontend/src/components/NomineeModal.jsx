import React, { useEffect } from "react";
import { X, Download } from "lucide-react";

const NomineeModal = ({ nominee, onClose, viewAll }) => {
  if (!nominee) return null;

  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
    
    // Re-enable scrolling when modal is closed
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleDownloadImage = () => {
    if (!nominee.nomineePhoto) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = nominee.nomineePhoto;
    
    // Extract filename from URL or use nominee name
    const fileName = nominee.nomineePhoto.split('/').pop() || `${nominee.nomineeName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.download = fileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Extract categories and get a mapping of category names to IDs
  const extractCategories = () => {
    if (!nominee.categories) return [];
    
    // If categories is already a simple array of strings
    if (typeof nominee.categories[0] === 'string') {
      return nominee.categories;
    }
    
    // If categories is an array of objects with category property
    if (nominee.categories[0]?.category?.name) {
      return nominee.categories.map(cat => cat.category.name);
    }
    
    // If categories is just an array of objects with name property
    if (nominee.categories[0]?.name) {
      return nominee.categories.map(cat => cat.name);
    }
    
    // Fallback - try to extract something meaningful
    return nominee.categories.map(cat => {
      if (typeof cat === 'string') return cat;
      if (cat.category) return cat.category.name || cat.category;
      return cat.name || 'Unknown Category';
    });
  };

  const categories = extractCategories();

  // Get the array of category vote data from categoryVotes object
  const getCategoryVotesArray = () => {
    if (!viewAll || !nominee.categoryVotes) return [];
    
    // Convert category votes object to array of { id, name, votes } objects
    return Object.entries(nominee.categoryVotes).map(([categoryId, votes]) => {
      // Find the corresponding category name - there isn't a direct way to map ID to name 
      // We'll use the categoryName field if available, or look for a match in categories array
      let categoryName = "Unknown Category";
      
      // Try to find category name from categories array
      if (nominee.categories && nominee.categories.length > 0) {
        // We're going to assume the order of categories matches the order of keys in categoryVotes
        const index = Object.keys(nominee.categoryVotes).indexOf(categoryId);
        if (index >= 0 && index < nominee.categories.length) {
          categoryName = nominee.categories[index];
        }
      }
      
      return {
        id: categoryId,
        name: categoryName,
        votes: votes || 0
      };
    }).sort((a, b) => b.votes - a.votes); // Sort by votes (highest first)
  };

  const categoryVotes = getCategoryVotesArray();
  const totalVotes = viewAll && nominee.totalVotes !== undefined ? nominee.totalVotes : nominee.votes || 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-700 w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{nominee.nomineeName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#ffb700] group">
              <img
                src={nominee.nomineePhoto || "https://via.placeholder.com/150"}
                alt={nominee.nomineeName}
                className="w-full h-full object-cover"
              />
              {nominee.nomineePhoto && (
                <button
                  onClick={handleDownloadImage}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Download Image"
                >
                  <Download className="h-8 w-8 text-white" />
                </button>
              )}
            </div>
            {nominee.nomineePhoto && (
              <button
                onClick={handleDownloadImage}
                className="mt-2 text-sm text-[#ffb700] hover:text-[#ffd700] flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download Image
              </button>
            )}
          </div>

          {nominee.nomineeEmail && (
            <p className="text-sm text-gray-400 text-center">{nominee.nomineeEmail}</p>
          )}

          <div className="flex flex-col items-center gap-2">
            {nominee.instagramUrl && (
              <p className="text-sm text-gray-300">
                <span className="font-medium text-[#ffb700]">Instagram:</span> {nominee.instagramUrl.split('/').pop()}
              </p>
            )}
            {nominee.facebookId && (
              <p className="text-sm text-gray-300">
                <span className="font-medium text-[#ffb700]">Facebook:</span> {nominee.facebookId}
              </p>
            )}
            {nominee.xId && (
              <p className="text-sm text-gray-300">
                <span className="font-medium text-[#ffb700]">Twitter:</span> {nominee.xId}
              </p>
            )}
            {nominee.youtubeId && (
              <p className="text-sm text-gray-300">
                <span className="font-medium text-[#ffb700]">YouTube:</span> {nominee.youtubeId}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#ffb700] mb-2 text-center">Categories</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.length > 0 ? (
                categories.map((category, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/20"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs">No categories assigned</span>
              )}
            </div>
          </div>

          {(nominee.votes !== undefined || nominee.totalVotes !== undefined) && (
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gray-800 rounded-md font-bold text-lg text-[#ffb700]">
                {totalVotes} {totalVotes === 1 ? "Vote" : "Votes"}
              </span>
              
              {/* Display votes by category when in viewAll mode and there's categoryVotes data */}
              {viewAll && categoryVotes.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-[#ffb700] mb-2">Votes by Category</h4>
                  <div className="space-y-2">
                    {categoryVotes.map((cat, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{cat.name}</span>
                        <span className="font-semibold text-white">{cat.votes} {cat.votes === 1 ? "vote" : "votes"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              nominee.status === "approved"
                ? "bg-green-500/20 text-green-500"
                : nominee.status === "rejected"
                ? "bg-red-500/20 text-red-500"
                : "bg-yellow-500/20 text-yellow-500"
            }`}>
              Status: {nominee.status?.charAt(0).toUpperCase() + nominee.status?.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomineeModal;