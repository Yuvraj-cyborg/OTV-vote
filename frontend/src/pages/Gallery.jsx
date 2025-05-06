import React from 'react';
import { Camera } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            GALLERY
          </span>
        </h1>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl p-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <Camera className="h-10 w-10 text-[#ffb700]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Access Your Event Photos!
                </h2>
                <p className="text-gray-300 mb-6">
                  To access your photo on OTV Insight 2025 using Face Recognition! , click here.
                </p>
                <a href="https://www.kwikpic.in/auth/login?uCode=57YTSF" className="px-8 py-3 bg-[#ffb700] hover:bg-[#ffb700]/80 text-black rounded-full font-semibold inline-flex items-center gap-2">
                  Click Here
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}