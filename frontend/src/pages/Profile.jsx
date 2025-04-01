import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api";
import { Instagram, Facebook, Twitter, Youtube, LogOut, Award, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-8 w-8 text-[#ffb700] animate-spin" />
    </div>
  );
};

const SocialLink = ({ platform, username, url }) => {
  if (!username) return null;
  
  let icon, bgColor, hoverBg;
  
  switch (platform) {
    case 'instagram':
      icon = <Instagram className="h-4 w-4" />;
      bgColor = 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500';
      hoverBg = 'hover:from-purple-600 hover:via-pink-600 hover:to-orange-600';
      break;
    case 'facebook':
      icon = <Facebook className="h-4 w-4" />;
      bgColor = 'bg-blue-600';
      hoverBg = 'hover:bg-blue-700';
      break;
    case 'twitter':
      icon = <Twitter className="h-4 w-4" />;
      bgColor = 'bg-blue-400';
      hoverBg = 'hover:bg-blue-500';
      break;
    case 'youtube':
      icon = <Youtube className="h-4 w-4" />;
      bgColor = 'bg-red-600';
      hoverBg = 'hover:bg-red-700';
      break;
    default:
      return null;
  }
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center justify-center p-2 rounded-full ${bgColor} ${hoverBg} text-white transition-colors`}
    >
      {icon}
    </a>
  );
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch user data and nominations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await fetchUserProfile();
        setUser(userResponse.data);
        
        const nominationsResponse = await fetchUserNominations();
        setNominations(nominationsResponse);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          toast.error("Please login to view your profile");
          navigate("/login");
        } else {
          toast.error("Failed to load profile data");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const hasNomination = nominations.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header with User Info */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 mb-8 shadow-lg shadow-black/20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {hasNomination && nominations[0].nomineePhoto ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#ffb700] flex-shrink-0">
                  <img
                    src={nominations[0].nomineePhoto}
                    alt="Nominee"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-[#ffb700] bg-gray-700 flex-shrink-0">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{user?.username || "User"}</h1>
                <p className="text-gray-300 mb-4">{user?.email || user?.userId}</p>
                
                <div className="flex justify-center md:justify-start space-x-3 mb-6">
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nominations Section */}
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-[#ffb700]" />
            Your Nominations
          </h2>
          
          {nominations.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center shadow-lg shadow-black/20">
              <p className="text-gray-300 mb-6">You haven't submitted any nominations yet.</p>
              <div className="max-w-lg mx-auto">
                <p className="text-gray-400 mb-6 text-sm">
                  Nominate yourself or others for the awards to showcase talent across different categories
                </p>
                <button
                  onClick={() => navigate("/nominate")}
                  className="px-6 py-2 bg-gradient-to-r from-[#ffb700] to-[#ff5e00] text-black font-medium rounded-lg hover:from-[#ffa600] hover:to-[#ff4e00] transition-all shadow-md shadow-orange-900/20"
                >
                  Submit a Nomination
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {nominations.map((nomination) => (
                <div key={nomination.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-[#ffb700] transition-all hover:shadow-lg hover:shadow-[#ffb700]/10 shadow-lg shadow-black/20">
                  <div className="flex flex-col md:flex-row">
                    {/* Nominee Image */}
                    {nomination.nomineePhoto && (
                      <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-700">
                        <img
                          src={nomination.nomineePhoto}
                          alt={nomination.nomineeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Nomination Content */}
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-2xl font-bold text-white mb-2">{nomination.nomineeName}</h3>
                      <p className="text-gray-300 text-sm mb-4">{nomination.nomineeEmail}</p>
                      
                      {/* Categories */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {nomination.categories?.map((cat, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                              {cat.category?.name || cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Social Media Links */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Social Profiles</h4>
                        <div className="flex space-x-3">
                          <SocialLink 
                            platform="instagram" 
                            username={nomination.instagramUrl} 
                            url={`https://instagram.com/${nomination.instagramUrl}`} 
                          />
                          <SocialLink 
                            platform="facebook" 
                            username={nomination.facebookId} 
                            url={`https://facebook.com/${nomination.facebookId}`} 
                          />
                          <SocialLink 
                            platform="twitter" 
                            username={nomination.xId} 
                            url={`https://x.com/${nomination.xId}`} 
                          />
                          <SocialLink 
                            platform="youtube" 
                            username={nomination.youtubeId} 
                            url={`https://youtube.com/channel/${nomination.youtubeId}`} 
                          />
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mt-6">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          nomination.status === 'approved' 
                            ? 'bg-green-900 text-green-300' 
                            : nomination.status === 'rejected'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {nomination.status === 'approved'
                            ? 'Approved'
                            : nomination.status === 'rejected'
                            ? 'Rejected'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
