import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../api";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginToast = toast.loading("Signing in...");
    
    try {
      const response = await loginUser({ userId, password });
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!", { id: loginToast });
      navigate(returnUrl);
    } catch (error) {
      toast.error(
        `Login failed: ${error.response?.data?.error || "Invalid credentials"}`,
        { id: loginToast }
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
      navigate(returnUrl);
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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-300">Sign in to your account</p>
          {returnUrl !== "/" && (
            <p className="mt-2 text-sm text-[#ffb700]">You'll be redirected back after login</p>
          )}
        </div>

        <div className="flex justify-center">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="signin_with"
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
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-[6vh] py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                  placeholder="User ID"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
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
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-black bg-[#ffb700] hover:bg-[#ffa600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb700]"
            >
              <span className="absolute right-3 inset-y-0 flex items-center">
                <ArrowRight className="h-5 w-5" />
              </span>
              Sign In
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/signup", { state: { returnUrl } })}
              className="text-[#ffb700] hover:text-[#ffa600]"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}