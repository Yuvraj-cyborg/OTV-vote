import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Vote,
  ChevronDown,
  Award,
  Users,
  Shield,
  Star,
  Mic,
  Camera,
  Brush,
  Code,
  Music,
  Film,
  Book,
  Heart,
  Calendar,
  MapPin,
  Loader,
} from "lucide-react";
import Navbar from "../components/Navbar";
import SponsorCarousel from "../components/SponsorCaraousel";
import { fetchPhaseState } from "../api";

export default function Landing() {
  const navigate = useNavigate();
  const [phaseState, setPhaseState] = useState({
    loading: true,
    isVotingPhase: false,
    error: null
  });

  // Fetch the current phase on component mount
  useEffect(() => {
    const getPhase = async () => {
      try {
        const phase = await fetchPhaseState();
        setPhaseState({
          loading: false,
          isVotingPhase: phase === "voting",
          error: null
        });
      } catch (error) {
        console.error("Error fetching phase:", error);
        setPhaseState({
          loading: false,
          isVotingPhase: false,
          error: "Failed to load phase information"
        });
      }
    };
    getPhase();
  }, []);

  // Loading state component
  const LoadingState = () => (
    <div className="flex items-center justify-center space-x-2">
      <Loader className="h-5 w-5 animate-spin text-[#ffb700]" />
      <span className="text-white">Loading...</span>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
            {/* Hero Section */}
      {/* Hero Section - Full Screen with Centered Content */}
<section className="relative h-screen w-full bg-black overflow-hidden">
  {/* Background Gradient */}
  <div className="absolute inset-0 z-0">
    <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-[#e50914]">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ffb700] blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-[#e50914] blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-[#ff5e00] blur-3xl"></div>
      </div>
    </div>
    <div className="absolute inset-0 bg-black/40"></div>
  </div>

  {/* Centered Content */}
  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
    <div className="max-w-3xl w-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
          INSIGHT
        </span>
        <br />
        <span className="text-white">2025</span>
      </h1>
      <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">Odisha's 1st Creators Award Show</h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white mb-8">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-[#ffb700]" />
          <span className="text-xl font-bold ml-2">COMING SOON</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-[#ffb700]" />
          <span className="ml-2">BHUBANESHWAR, ODISHA</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {phaseState.loading ? (
          <LoadingState />
        ) : phaseState.error ? (
          <div className="text-red-500">{phaseState.error}</div>
        ) : (
          <>
            <button
              onClick={() => navigate(phaseState.isVotingPhase ? "/vote" : "/nominate")}
              className="px-8 py-3 bg-[#e50914] hover:bg-[#ff5e00] text-white rounded-full cursor-pointer font-semibold flex items-center justify-center"
            >
              {phaseState.isVotingPhase ? "Vote Now" : "Nominate Now"}
              <ChevronDown className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/categories")}
              className="px-8 py-3 bg-transparent border border-white text-white rounded-full cursor-pointer font-semibold hover:bg-white hover:text-black transition-colors"
            >
              View Categories
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</section>

    
      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">AWARD CATEGORIES</span>
            <br />
            <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
              FOR INSIGHT 2025
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Storyteller of the Year", desc: "For those who weave magic with words, visuals, and emotions" },
              { name: "Best Travel Influencer", desc: "Explorers who take us on unforgettable journeys around Odisha and India" },
              { name: "Best Food Creator", desc: "From street food gems to gourmet delicacies, these creators redefine food storytelling" },
              { name: "Best Art Influencer", desc: "Visionaries who turn imagination into reality through art" },
              { name: "Best Lifestyle/Fashion Influencer", desc: "Trendsetters who inspire us with their style and everyday elegance" },
              { name: "Impact Creator of the Year", desc: "Changemakers using platforms for awareness and positive transformation" },
              { name: "Guardian of Heritage Award", desc: "Honoring those who preserve and celebrate our cultural treasures" },
              { name: "Regional Influencer of the Year", desc: "Voices that amplify regional stories and communities" },
              { name: "Cultural Ambassador of the Year", desc: "Champions of our traditions, art, and heritage" },
              { name: "Sambalpuri Icon of the Year", desc: "Recognizing work that brings Sambalpuri culture into the limelight" },
              { name: "Rising Star of the Year", desc: "Breakout creators making waves and capturing hearts" },
              { name: "Best Comedy Creator", desc: "Masters of humor delivering laughter and pure joy" },
              { name: "Best Music Creator", desc: "Artists redefining how we experience music online" },
              { name: "Podcast of the Year", desc: "Celebrating the best in podcasting with inspiring conversations" },
              { name: "Excellence in Digital Journalism", desc: "Fearless, innovative storytelling in digital news" },
              { name: "Digital News Leader", desc: "Pioneers setting benchmarks for credible digital reporting" },
              { name: "Creator of the Year", desc: "The ultimate content powerhouse inspiring millions" },
              { name: "Global Odia Creator Award", desc: "Honoring Odia creators making a mark beyond borders" },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-md"
              >
                <h3 className="text-xl font-bold mb-2 text-[#ffb700]">{category.name}</h3>
                <p className="text-gray-300 mb-4">{category.desc}</p>
                <button
                  onClick={() => navigate(`/categories`)}
                  className="text-white hover:text-[#ff5e00] p-0"
                >
                  Learn More <ChevronDown className="ml-1 h-4 w-4 inline" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* Why Nominate Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">WHY PARTICIPATE IN INSIGHT 2025?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Credibility & Recognition</h3>
              <p className="text-gray-300">
                Establish yourself as a pioneer in Odisha's digital space with recognition from OTV, Odisha's largest media network.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Amplify Your Influence</h3>
              <p className="text-gray-300">
                With television, live-streaming, and digital amplification, your work will be showcased to millions, expanding your reach beyond social media.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Community-Driven & Transparent</h3>
              <p className="text-gray-300">
                Unlike closed-door jury selections, INSIGHT 2025 puts power in audience hands with public nomination and voting for authentic recognition.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8 md:col-span-3">
              <h3 className="text-xl font-bold text-white mb-4">Connect, Learn & Grow</h3>
              <p className="text-gray-300">
                Beyond awards, it's a hub for creators, brands, and experts. Attend exclusive panels and networking sessions to fuel your next breakthrough. Gain insights from industry leaders shaping the digital world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#e50914] to-[#ffb700]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to be recognized?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join Odisha's most prestigious digital creators award show and showcase your talent to the world.
          </p>
          {phaseState.loading ? (
            <LoadingState />
          ) : phaseState.error ? (
            <div className="text-red-500">{phaseState.error}</div>
          ) : (
            <button
              onClick={() => navigate(phaseState.isVotingPhase ? "/vote" : "/nominate")}
              className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-full cursor-pointer font-semibold"
            >
              {phaseState.isVotingPhase ? "Cast Your Vote Now" : "Submit Your Nomination"}
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">INSIGHT 2025</h3>
              <p className="text-gray-400">
                Odisha's 1st Creators Award Show celebrating digital voices shaping the state's evolving landscape.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@insight2025.com</p>
              <p className="text-gray-400">Phone: +91 XXXXX XXXXX</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#ffb700]">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb700]">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb700]">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb700]">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} INSIGHT 2025. All rights reserved. Powered by OTV.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}