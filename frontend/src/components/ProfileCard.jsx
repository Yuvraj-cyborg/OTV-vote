import React, { useRef, useState } from 'react';
import { Download, Share2, Instagram, Facebook, Twitter, Youtube, Loader2 } from 'lucide-react';
import domtoimage from 'dom-to-image';

const ProfileCard = ({ nomination }) => {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  if (!nomination) return null;
  
  // Function to download the card as an image
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    
    try {
      // Simple delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert DOM to image with dom-to-image
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        bgcolor: '#111827',
        style: {
          'border-radius': '24px'
        },
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${nomination.nomineeName.replace(/\s+/g, '-').toLowerCase()}-insight-nomination.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Error downloading card:', error);
      alert(`Unable to download card: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to share the card
  const handleShare = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    
    try {
      // Simple delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert DOM to image with dom-to-image
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        bgcolor: '#111827',
        style: {
          'border-radius': '24px'
        },
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Use Web Share API if available
      if (navigator.share) {
        try {
          const file = new File([blob], `${nomination.nomineeName.replace(/\s+/g, '-').toLowerCase()}-nomination.png`, {
            type: 'image/png'
          });
          
          await navigator.share({
            title: 'My INSIGHT 2025 Nomination',
            text: `Check out ${nomination.nomineeName}'s nomination for Insight 2025 - Odisha's 1st Creators Awards!`,
            files: [file]
          });
        } catch (error) {
          console.error('Error sharing:', error);
          // Try direct download as fallback
          handleDownload();
        }
      } else {
        // Fallback for browsers that don't support sharing
        handleDownload();
      }
    } catch (error) {
      console.error('Error preparing share:', error);
      alert(`Unable to share card: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to get category names
  const getCategoryNames = () => {
    if (!nomination.categories) return [];
    
    return nomination.categories.map(cat => {
      if (typeof cat === 'object') {
        // Handle the structure from User Nominations API
        if (cat.category && cat.category.name) {
          return cat.category.name;
        }
        // Handle other object formats
        return cat.name || "Category";
      }
      // Handle string format
      return cat;
    });
  };
  
  // Helper function to determine which social media icons to show
  const getSocialIcons = () => {
    const icons = [];
    
    if (nomination.instagramUrl) 
      icons.push(<Instagram key="instagram" className="h-5 w-5 text-pink-500" />);
    
    if (nomination.facebookId) 
      icons.push(<Facebook key="facebook" className="h-5 w-5 text-blue-600" />);
    
    if (nomination.xId) 
      icons.push(<Twitter key="twitter" className="h-5 w-5 text-blue-400" />);
    
    if (nomination.youtubeId) 
      icons.push(<Youtube key="youtube" className="h-5 w-5 text-red-600" />);
    
    return icons;
  };
  
  // Get all categories for display
  const categories = getCategoryNames();
  // Determine if we need to make the categories smaller
  const needsSmallerCategories = categories.length > 3;
  
  return (
    <div className="flex flex-col items-center">
      {/* Card Preview */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-700"
        style={{ 
          borderRadius: '24px',
          width: '380px',
          padding: '24px',
          maxWidth: '100%',
          minHeight: categories.length > 4 ? '580px' : '520px'
        }}
      >
        {/* Header with Logo */}
        <div 
          className="absolute top-0 left-0 right-0 flex justify-between items-center"
          style={{
            padding: '12px 24px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            className="text-xl font-bold" 
            style={{ color: '#ffb700' }}
          >
            INSIGHT 2025
          </div>
          <div className="text-xs text-white">Odisha's 1st Creators Awards</div>
        </div>
        
        {/* Main Content */}
        <div style={{ paddingTop: '60px', paddingBottom: '16px' }}>
          {/* Profile Image */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div 
                className="rounded-full overflow-hidden"
                style={{ 
                  width: '128px', 
                  height: '128px', 
                  border: '4px solid #ffb700',
                  position: 'relative'
                }}
              >
                <img
                  src={nomination.nomineePhoto || "https://via.placeholder.com/150"}
                  alt={nomination.nomineeName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Name */}
          <div className="text-center mb-5">
            <h2 
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px'
              }}
            >
              {nomination.nomineeName}
            </h2>
            <div className="flex justify-center space-x-2">
              {getSocialIcons()}
            </div>
          </div>
          
          {/* Categories Container with fixed width */}
          <div 
            style={{
              width: '300px',
              margin: '0 auto 20px',
              textAlign: 'center'
            }}
          >
            {/* Categories */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: needsSmallerCategories ? '6px' : '8px',
              }}
            >
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      padding: needsSmallerCategories ? '3px 8px' : '4px 10px',
                      borderRadius: '9999px',
                      fontSize: needsSmallerCategories ? '0.65rem' : '0.75rem',
                      fontWeight: '500',
                      backgroundColor: 'rgba(255, 183, 0, 0.2)',
                      color: '#ffb700',
                      border: '1px solid rgba(255, 183, 0, 0.3)',
                      display: 'inline-block',
                      margin: '0 0 6px 0', // Use margin instead of gap for better control
                      maxWidth: '140px', // Prevent very long category names
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span
                  style={{ 
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: 'rgba(107, 114, 128, 0.2)',
                    color: '#9ca3af',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                  }}
                >
                  No categories
                </span>
              )}
            </div>
          </div>
          
          {/* Watermark */}
          <div className="text-center mt-6">
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              www.otvinsight.com
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button 
          onClick={handleDownload}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-[#ffb700] text-black rounded-lg hover:bg-[#ffa600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download Card
        </button>
        <button 
          onClick={handleShare}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Share2 className="h-4 w-4 mr-2" />
          )}
          Share Card
        </button>
      </div>
    </div>
  );
};

export default ProfileCard; 