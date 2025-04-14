import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ProfileCard from './ProfileCard';

const ProfileModal = ({ isOpen, onClose, nomination }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore scrolling when modal closes
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Handle clicking outside to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700 relative animate-fadeIn">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Share Your Nomination
          </h2>
          
          <ProfileCard nomination={nomination} />
          
          <div className="text-center mt-8 text-sm text-gray-400">
            <p>Download your nomination card and share it on social media!</p>
            <p className="mt-1">Use hashtag <span className="text-[#ffb700]">#INSIGHT2025</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 