import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, fetchUserNominations } from "../api";
import { Instagram, Facebook, Twitter, Youtube, LogOut, Award, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";


const LoadingPage = ({ message = "Loading your profile..." }) => {
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
    <a href={url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center p-2 rounded-full ${bgColor} ${hoverBg} text-white transition-colors`}>
      {icon}
    </a>
  );
};

export default function Profile() {
  const isLoggedIn = !!localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await fetchUserProfile();
        console.log("User profile data:", userResponse.data);
        setUser(userResponse.data);
        
        // Fetch nominations using the authenticated endpoint
        console.log("Fetching nominations for user");
        const userNominations = await fetchUserNominations();
        console.log("User nominations:", userNominations);
        
        // Process nominations to handle any relative image URLs
        const processedNominations = userNominations.map(nomination => {
          // If nomineePhoto is a relative path, convert to absolute URL
          if (nomination.nomineePhoto && !nomination.nomineePhoto.startsWith('http')) {
            nomination.nomineePhoto = `https://otv-vote.onrender.com${nomination.nomineePhoto}`;
          }
          return nomination;
        });
        
        setNominations(processedNominations || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
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

    if (isLoggedIn) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [navigate, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {nominations?.length > 0 && nominations[0]?.nomineePhoto ? (
                <img src={nominations[0].nomineePhoto} alt="Profile" className="w-32 h-32 rounded-full border-4 border-[#ffb700]" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-[#ffb700] flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {nominations?.length > 0 ? nominations[0]?.nomineeName : user?.username}
                </h1>
                <p className="text-gray-300 mb-4">{user?.userId}</p>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-[#ffb700]" /> Your Nominations
          </h2>
          {nominations?.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <p className="text-gray-300 mb-6">No nominations found.</p>
              <button onClick={() => navigate("/nominate")} className="px-6 py-2 bg-[#ffb700] text-black rounded-lg hover:bg-[#ffa600]">
                Submit a Nomination
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nominations.map(nomination => (
                <div key={nomination.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{nomination.nomineeName}</h3>
                      <p className="text-gray-400 text-sm mb-2">{nomination.nomineeEmail}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${nomination.status === 'approved' ? 'bg-green-900 text-green-300' : nomination.status === 'rejected' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {nomination.status.charAt(0).toUpperCase() + nomination.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {nomination.categories?.map((cat, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        {cat.category?.name || "Category"}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {nomination.instagramUrl && (
                      <SocialLink platform="instagram" username={nomination.instagramUrl} url={`https://instagram.com/${nomination.instagramUrl}`} />
                    )}
                    {nomination.facebookId && (
                      <SocialLink platform="facebook" username={nomination.facebookId} url={`https://facebook.com/${nomination.facebookId}`} />
                    )}
                    {nomination.xId && (
                      <SocialLink platform="twitter" username={nomination.xId} url={`https://twitter.com/${nomination.xId}`} />
                    )}
                    {nomination.youtubeId && (
                      <SocialLink platform="youtube" username={nomination.youtubeId} url={`https://youtube.com/${nomination.youtubeId}`} />
                    )}
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
