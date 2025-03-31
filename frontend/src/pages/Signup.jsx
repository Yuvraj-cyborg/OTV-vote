import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, sendOTP, loginWithGoogle } from "../api";
import { Mail, Lock, User } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Signup() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!userId || !username) {
      toast.error("Email and Username are required to send OTP.");
      return;
    }

    const otpToast = toast.loading("Sending OTP...");
    try {
      await sendOTP({ userId, username });
      setIsOTPSent(true);
      toast.success("OTP sent to your email!", { id: otpToast });
    } catch (error) {
      toast.error(
        `Failed to send OTP: ${error.response?.data?.error || "Try again later"}`,
        { id: otpToast }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !username || !password || !otp) {
      toast.error("All fields are required.");
      return;
    }

    const signupToast = toast.loading("Creating account...");
    try {
      await registerUser({ userId, username, password, otp });
      toast.success("Signup successful! Please login.", { id: signupToast });
      navigate("/login");
    } catch (error) {
      toast.error(
        `Signup failed: ${error.response?.data?.error || "Try again later"}`,
        { id: signupToast }
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const googleToast = toast.loading("Signing in with Google...");
    
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await loginWithGoogle({
        credential: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
      localStorage.setItem("token", response.data.token);
      toast.success("Google login successful!", { id: googleToast });
      navigate("/");
    } catch (error) {
      toast.error(
        `Google login failed: ${error.response?.data?.error || "Try again later"}`,
        { id: googleToast }
      );
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="overflow-hidden min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center py-[12vh] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-300">Join our community today</p>
        </div>

        <div className="flex justify-center">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="signup_with"
              shape="pill"
              size="large"
              theme="filled_blue"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">OR</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-white">
                Email
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
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-black bg-[#ffb700] hover:bg-[#ffa600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb700]"
              >
                Signup
              </button>
            )}
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#ffb700] hover:text-[#ffa600]"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}