import { Link, useLocation } from "react-router-dom";
import { UserCircle2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Categories", href: "/categories" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      {/* Tight container with minimal padding */}
      <div className="mx-auto px-2.5 sm:px-4 md:min-w-screen md:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo - tighter spacing */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-white font-bold text-lg md:text-2xl">Influencer</span>
              <span className="text-[#ffb700] font-bold text-lg md:text-2xl ml-1">Awards</span>
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
              <Link 
                to="/profile" 
                className="p-1.5 text-gray-300 hover:text-white"
                aria-label="Profile"
              >
                <UserCircle2 className="w-5 h-5" />
              </Link>
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

      {/* Mobile Menu - tighter layout */}
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
            <Link
              to="/profile"
              className={`block px-2 py-2 text-sm font-medium rounded ${location.pathname === '/profile' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              Profile
            </Link>
          ) : (
            <div className="pt-1 space-y-1.5">
              <Link
                to="/login"
                className="block w-full px-2 py-2 text-center bg-[#ffb700] text-black rounded-full font-medium hover:bg-[#ff5e00] text-sm"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block w-full px-2 py-2 text-center border border-white text-white rounded-full font-medium hover:bg-white hover:text-black text-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}