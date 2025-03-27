import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, sendOTP } from "../api";
import { Mail, Lock, User } from "lucide-react";

export default function Signup() {
  const [userId, setUserId] = useState(""); // Email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!userId || !username) {
      alert("Email and Username are required to send OTP.");
      return;
    }

    try {
      await sendOTP({ userId: userId, username: username });
      setIsOTPSent(true);
      alert("✅ OTP sent to your email!");
    } catch (error) {
      alert(`❌ Failed to send OTP: ${error.response?.data?.error || "Try again later"}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !username || !password || !otp) {
      alert("All fields are required.");
      return;
    }

    try {
      await registerUser({ userId, username, password, otp });
      alert("✅ Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(`❌ Signup failed: ${error.response?.data?.error || "Try again later"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-300">Join our community today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email (UserID) */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-white">
                Email (User ID)
              </label>
              <div className="mt-1 relative">
                <input
                  id="userId"
                  name="userId"
                  type="email"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-[6vh] py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                  placeholder="john@example.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-[6vh] py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                  placeholder="John Doe"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-[6vh] py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* OTP Field */}
            {isOTPSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-white">
                  OTP
                </label>
                <div className="mt-1 relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                    placeholder="Enter OTP"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            {!isOTPSent ? (
              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-black bg-[#ffb700] hover:bg-[#ffa600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb700]"
              >
                Send OTP
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-black bg-[#ffb700] hover:bg-[#ffa600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb700]"
              >
                Signup
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}