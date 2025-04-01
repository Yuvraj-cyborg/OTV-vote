import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle2, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import otvlogo from "../assets/otv-logo.png";
import toast from "react-hot-toast";
import { fetchPhaseState } from "../api";

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null); // Track nomination/voting phase
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch the current phase
    async function fetchPhase() {
      try {
        const response = await fetchPhaseState();
        setCurrentPhase(response);
      } catch (error) {
        console.error("Failed to fetch phase:", error);
      }
    }
    fetchPhase();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Categories", href: "/categories" },
    { name: currentPhase === "nomination" ? "Nominate" : "Vote", href: currentPhase === "nomination" ? "/nominate" : "/vote" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="mx-auto px-2.5 sm:px-4 md:min-w-screen md:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={otvlogo} alt="Logo" className="h-[9vh] w-[25vh]" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium ${location.pathname === link.href ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="p-1.5 text-gray-300 hover:text-white relative"
                  aria-label="Profile"
                >
                  <UserCircle2 className="w-6 h-6" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10 animate-fadeIn">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-800 hover:text-white flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 bg-[#ffb700] text-black rounded-full font-medium hover:bg-[#ff5e00] text-xs sm:text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 border border-white text-white rounded-full font-medium hover:bg-white hover:text-black text-xs sm:text-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-300 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
<div className={`md:hidden bg-black/95 transition-all duration-200 ease-out ${isMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
  <div className="px-2.5 py-1.5 space-y-1">
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.href}
        className={`block px-2 py-2 text-sm font-medium rounded ${location.pathname === link.href ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        {link.name}
      </Link>
    ))}

    {isLoggedIn ? (
      <>
        <Link
          to="/profile"
          className={`block px-2 py-2 text-sm font-medium rounded ${location.pathname === '/profile' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-2 py-2 text-sm font-medium rounded text-gray-300 hover:bg-red-900 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </>
    ) : (
      <>
        <Link
          to="/login"
          className="block px-2 py-2 text-sm font-medium rounded text-gray-300 hover:bg-gray-700"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="block px-2 py-2 text-sm font-medium rounded text-gray-300 hover:bg-gray-700"
        >
          Sign up
        </Link>
      </>
    )}
  </div>
</div>

    </nav>
  );
}
