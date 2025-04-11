import React, { useEffect } from "react";
import { X, Download } from "lucide-react";

const NomineeModal = ({ nominee, onClose }) => {
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
              {nominee.categories?.map((category, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/20"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {nominee.votes !== undefined && (
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gray-800 rounded-md font-bold text-lg text-[#ffb700]">
                {nominee.votes || 0} Votes
              </span>
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