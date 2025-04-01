import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Mic,
  Camera,
  Brush,
  Code,
  Music,
  Film,
  Book,
  MapPin,
  ChevronRight,
  Award,
  Globe,
  TrendingUp,
  Laugh,
  Podcast,
  Newspaper,
  Users,
  Feather,
  Loader
} from 'lucide-react';
import { fetchPhaseState } from "../api";
import { useState, useEffect } from 'react';

export default function Categories() {
  const navigate = useNavigate();

  const categories = [
    { 
      icon: Star, 
      name: "Storyteller of the Year", 
      desc: "Weaving magic with words, visuals, and emotions",
      subcategories: ["Short Stories", "Visual Storytelling", "Poetry"]
    },
    { 
      icon: Mic, 
      name: "Best Travel Influencer", 
      desc: "Explorers taking us on unforgettable journeys",
      subcategories: ["Local Guides", "International Travel", "Adventure"]
    },
    { 
      icon: Camera, 
      name: "Best Food Creator", 
      desc: "Redefining the art of food storytelling",
      subcategories: ["Street Food", "Fine Dining", "Home Cooking"]
    },
    { 
      icon: Brush, 
      name: "Best Art Influencer", 
      desc: "Turning imagination into reality through art",
      subcategories: ["Digital Art", "Traditional Art", "Sculpture"]
    },
    { 
      icon: Code, 
      name: "Best Lifestyle Influencer", 
      desc: "Trendsetters inspiring with style and elegance",
      subcategories: ["Fashion", "Home Decor", "Wellness"]
    },
    { 
      icon: Music, 
      name: "Impact Creator of the Year", 
      desc: "Using platforms for awareness and transformation",
      subcategories: ["Social Change", "Education", "Community Building"]
    },
    { 
      icon: Film, 
      name: "Guardian of Heritage Award", 
      desc: "Preserving cultural and historical treasures",
      subcategories: ["Folk Arts", "Traditional Crafts", "Cultural Preservation"]
    },
    { 
      icon: Book, 
      name: "Regional Influencer of the Year", 
      desc: "Amplifying regional stories and communities",
      subcategories: ["Language Content", "Local Traditions", "Regional Development"]
    },
    { 
      icon: Globe, 
      name: "Cultural Ambassador of the Year", 
      desc: "Champions of our traditions, art, and heritage",
      subcategories: ["Cultural Events", "Traditional Arts", "Heritage Promotion"]
    },
    { 
      icon: Award, 
      name: "Sambalpuri Icon of the Year", 
      desc: "Bringing Sambalpuri culture into the limelight",
      subcategories: ["Sambalpuri Music", "Sambalpuri Dance", "Sambalpuri Textiles"]
    },
    { 
      icon: TrendingUp, 
      name: "Rising Star of the Year", 
      desc: "Breakout creators making waves and capturing hearts",
      subcategories: ["New Creators", "Emerging Talent", "Fresh Perspectives"]
    },
    { 
      icon: Laugh, 
      name: "Best Comedy Creator", 
      desc: "Masters of humor delivering laughter and pure joy",
      subcategories: ["Skits", "Stand-up", "Impressions"]
    },
    { 
      icon: Music, 
      name: "Best Music Creator", 
      desc: "Artists redefining how we experience music online",
      subcategories: ["Covers", "Original Music", "Music Production"]
    },
    { 
      icon: Podcast, 
      name: "Podcast of the Year", 
      desc: "Celebrating the best in podcasting with inspiring conversations",
      subcategories: ["Interviews", "Storytelling", "Educational"]
    },
    { 
      icon: Newspaper, 
      name: "Excellence in Digital Journalism", 
      desc: "Fearless, innovative storytelling in digital news",
      subcategories: ["Investigative", "Feature Stories", "News Analysis"]
    },
    { 
      icon: Users, 
      name: "Digital News Leader", 
      desc: "Pioneers setting benchmarks for credible digital reporting",
      subcategories: ["Breaking News", "Community Reporting", "Mobile Journalism"]
    },
    { 
      icon: Star, 
      name: "Creator of the Year", 
      desc: "The ultimate content powerhouse inspiring millions",
      subcategories: ["Content Quality", "Engagement", "Innovation"]
    },
    { 
      icon: Feather, 
      name: "Global Odia Creator Award", 
      desc: "Honoring Odia creators making a mark beyond borders",
      subcategories: ["International Reach", "Cross-cultural Content", "Diaspora Engagement"]
    }
  ];
  const LoadingState = () => (
    <div className="flex items-center justify-center space-x-2">
      <Loader className="h-5 w-5 animate-spin text-[#ffb700]" />
      <span className="text-white">Loading...</span>
    </div>
  );

const [phaseState, setPhaseState] = useState({
    loading: true,
    isVotingPhase: false,
    error: null
  });

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

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
              AWARD CATEGORIES
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the diverse categories celebrating Odisha's digital creators
          </p>
          <div className="flex items-center justify-center mt-4 text-[#ffb700]">
            <MapPin className="h-5 w-5 mr-2" />
            <span>INSIGHT 2025 | Bhubaneswar, Odisha</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-[#ffb700] transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-800 rounded-lg text-[#ffb700] group-hover:bg-[#ffb700] group-hover:text-black transition-colors">
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{category.name}</h2>
                  <p className="text-gray-400 mt-1">{category.desc}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#ffb700] mb-2">Featured</h3>
                <ul className="space-y-2">
                  {category.subcategories.map((subcat, i) => (
                    <li key={i} className="flex items-center text-gray-300 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-2 text-[#ffb700]" />
                      {subcat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          {phaseState.loading ? (
            <LoadingState />
          ) : phaseState.error ? (
            <div className="text-red-500">{phaseState.error}</div>
          ) : (
            <button
              onClick={() => navigate(phaseState.isVotingPhase ? "/vote" : "/nominate")}
              className="px-8 py-3 bg-[#e50914] hover:bg-[#ff5e00] text-white rounded-full cursor-pointer font-semibold"
            >
              {phaseState.isVotingPhase ? "Cast Your Vote Now" : "Submit Your Nomination"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}