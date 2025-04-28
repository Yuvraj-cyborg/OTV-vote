import React from "react";
import { Calendar, MapPin, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VotingOver() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black/90 backdrop-blur-md flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <div className="max-w-3xl mx-auto bg-gray-900/50 rounded-xl p-8 border border-gray-700 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Voting Phase is Over
        </h1>
        
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#ffb700]/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#ffb700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          
          <p className="text-xl text-gray-300 mb-6">
            Thank you for your interest in INSIGHT 2025 Awards! 
          </p>
          
          <p className="text-lg text-gray-400 mb-4">
            The voting phase has concluded. The finalists will now be evaluated by our esteemed jury panel.
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center text-[#ffb700]">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-medium">Jury Evaluation</span>
            </div>
            <div className="flex items-center text-[#ffb700]">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-medium">Final Selection</span>
            </div>
          </div>
          
          <p className="text-lg text-white bg-[#ffb700]/10 py-3 px-4 rounded-lg inline-block font-semibold">
            Stay tuned for the results announcement!
          </p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#ffb700] mb-4">Event Details</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white mb-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-[#ffb700]" />
              <span className="text-lg ml-2">3rd MAY 2025</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#ffb700]" />
              <span className="ml-2">SWOSTI PREMIUM, BHUBANESWAR</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-[#ffb700] hover:bg-[#ffb700]/80 text-black rounded-full font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
} 