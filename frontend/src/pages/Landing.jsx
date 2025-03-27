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
      <Navbar/>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-black">
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

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
                INFLUENCER
              </span>
              <br />
              <span className="text-white">AWARDS 2025</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">CELEBRATING THE POWER OF INFLUENCE</h2>

            <div className="flex items-center space-x-2 text-white mb-8">
              <Calendar className="h-5 w-5 text-[#ffb700]" />
              <span className="text-xl font-bold">14 NOV</span>
              <MapPin className="h-5 w-5 ml-4 text-[#ffb700]" />
              <span> NONE, BHUBANESHWAR</span>
            </div>

            <div className="flex flex-wrap gap-4">
              {phaseState.loading ? (
                <LoadingState />
              ) : phaseState.error ? (
                <div className="text-red-500">{phaseState.error}</div>
              ) : (
                <>
                  <button
                    onClick={() => navigate(phaseState.isVotingPhase ? "/vote" : "/nominate")}
                    className="px-8 py-3 bg-[#e50914] hover:bg-[#ff5e00] text-white rounded-full cursor-pointer font-semibold flex items-center justify-center space-x-2"
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
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">CATEGORIES</span>
            <br />
            <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
              INFLUENCER AWARDS
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Star, name: "Rising Star", desc: "Emerging talents making waves" },
              { icon: Mic, name: "Public Speaking", desc: "Outstanding orators and presenters" },
              { icon: Camera, name: "Photography", desc: "Capturing moments that matter" },
              { icon: Brush, name: "Digital Art", desc: "Creative digital masterpieces" },
              { icon: Code, name: "Technology", desc: "Innovation in tech" },
              { icon: Music, name: "Music", desc: "Exceptional musical talent" },
              { icon: Film, name: "Film & Video", desc: "Cinematic excellence" },
              { icon: Book, name: "Content Creation", desc: "Engaging digital content" },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-md"
              >
                <div className="text-5xl mb-4 text-[#ffb700]">
                  <category.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-300 mb-4">{category.desc}</p>
                <button
                  onClick={() => navigate(`/categories/${category.name.toLowerCase().replace(/ /g, "-")}`)}
                  className="text-[#ffb700] hover:text-[#ff5e00] p-0"
                >
                  View Subcategories <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nominate Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">WHY SHOULD YOU NOMINATE?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Keynotes & Sessions With Thought Leaders</h3>
              <p className="text-gray-300">
                Experience a stellar lineup of speakers at the Influencer Awards, delivering keynotes and sessions for
                brands and influencers. Gain valuable insights and opportunities for growth.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">A Fusion Between Brands And Influencers</h3>
              <p className="text-gray-300">
                Our platform is the perfect space for brands and influencers to connect, discuss business, and build
                valuable connections. Join us and forge new relationships with ease.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Networking Opportunities</h3>
              <p className="text-gray-300">
                Navigating social media for connections can be challenging. Our event offers a golden opportunity to
                strengthen your brand by fostering lasting connections among influencers. Join us and supercharge your
                network.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Watch Sessions On Repeat</h3>
              <p className="text-gray-300">
                You can watch any session any time at your convenience from your device. Never miss an important insight
                or connection opportunity.
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
            Join the most prestigious influencer awards event and showcase your talent to the world.
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
              {phaseState.isVotingPhase ? "Cast Your Vote" : "Submit Your Nomination"}
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Influencer Awards 2025</h3>
              <p className="text-gray-400">
                Celebrating the power of influence and recognizing outstanding talent in the industry.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@influencerawards.com</p>
              <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
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
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Influencer Awards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}