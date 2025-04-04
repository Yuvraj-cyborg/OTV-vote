import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Lock } from "lucide-react";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Admin credentials check (hardcoded for security, should be done on backend)
    if (email === "admin@odishatv.in" && password === "Odishatv@password") {
      // Store a token to indicate admin login
      localStorage.setItem("adminToken", btoa("admin@odishatv.in:Odishatv@password"));
      
      // Show success message
      toast.success("Login successful!");
      
      // Redirect to admin page
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } else {
      toast.error("Invalid admin credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
          <p className="mt-2 text-gray-400">Enter your credentials to access the admin panel</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                placeholder="admin@example.com"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-black bg-[#ffb700] hover:bg-[#ffa600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb700] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Logging in...
                </span>
              ) : (
                "Login to Admin Panel"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 