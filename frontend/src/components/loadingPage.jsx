import { Loader2 } from "lucide-react";

const LoadingPage = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-12 w-12 text-[#ffb700] animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Please wait</h2>
        <p className="text-gray-300">{message}</p>
        
        {/* Optional: Animated dots for visual interest */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="h-2 w-2 bg-[#ffb700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-[#e50914] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-[#ff5e00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;