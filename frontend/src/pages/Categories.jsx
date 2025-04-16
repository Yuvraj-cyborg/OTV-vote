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
  Loader,
  ExternalLink,
  Dumbbell,
  Gamepad2
} from 'lucide-react';
import { fetchPhaseState } from "../api";
import { useState, useEffect } from 'react';
import sponsors from '../sponsors';

export default function Categories() {
  const navigate = useNavigate();

  const categories = [
    { 
      icon: Star, 
      name: "Storyteller of the Year", 
      desc: "For creators who craft compelling narratives that highlight Odisha's culture, traditions, or contemporary life.",
      example: "A YouTube series exploring lesser-known Odia festivals or an Instagram account sharing daily life stories from rural Odisha.",
      subcategories: ["Short Stories", "Visual Storytelling", "Poetry"]
    },
    { 
      icon: Mic, 
      name: "Best Travel Influencer", 
      desc: "For digital nomads and explorers showcasing Odisha's landscapes, heritage sites, and hidden gems.",
      example: "A travel blog detailing road trips across Odisha's tribal regions or a vlog series on coastal destinations.",
      subcategories: ["Local Guides", "International Travel", "Adventure"]
    },
    { 
      icon: Camera, 
      name: "Best Food Creator", 
      desc: "For culinary enthusiasts presenting Odia cuisine through recipes, food reviews, or cultural insights.",
      example: "A cooking channel demonstrating traditional Odia dishes or a food critic reviewing local eateries.",
      subcategories: ["Street Food", "Fine Dining", "Home Cooking"]
    },
    { 
      icon: Brush, 
      name: "Best Art Influencer", 
      desc: "For artists and curators promoting Odia art forms, crafts, and visual storytelling.",
      example: "An Instagram gallery featuring Pattachitra artworks or a blog discussing contemporary Odia artists.",
      subcategories: ["Digital Art", "Traditional Art", "Sculpture"]
    },
    { 
      icon: Code, 
      name: "Best Lifestyle/Fashion Influencer", 
      desc: "For influencers blending Odia fashion and lifestyle with modern trends, promoting sustainable and cultural aesthetics.",
      example: "A fashion influencer styling Sambalpuri sarees in contemporary ways or a lifestyle blogger highlighting Odia home decor.",
      subcategories: ["Fashion", "Home Decor", "Wellness"]
    },
    { 
      icon: Music, 
      name: "Impact Creator of the Year", 
      desc: "For individuals using digital platforms to drive social change, awareness, and community engagement in Odisha.",
      example: "A content creator advocating for environmental conservation in Odisha or a campaign promoting Odia language preservation.",
      subcategories: ["Social Change", "Education", "Community Building"]
    },
    { 
      icon: Film, 
      name: "Guardian of Heritage Award", 
      desc: "For creators preserving and promoting Odisha's rich cultural heritage through digital mediums.",
      example: "A documentary series on traditional Odia crafts or a blog dedicated to Odia folklore.",
      subcategories: ["Folk Arts", "Traditional Crafts", "Cultural Preservation"]
    },
    { 
      icon: Book, 
      name: "Regional Influencer of the Year", 
      desc: "For content creators amplifying regional stories, languages, and communities within Odisha.",
      example: "A podcast discussing regional dialects or a video series on local festivals.",
      subcategories: ["Language Content", "Local Traditions", "Regional Development"]
    },
    { 
      icon: Globe, 
      name: "Cultural Ambassador of the Year", 
      desc: "For champions of Odisha's traditions, arts, and heritage, bringing them to a broader audience.",
      example: "An influencer promoting classical Odissi dance or organizing virtual tours of heritage sites.",
      subcategories: ["Cultural Events", "Traditional Arts", "Heritage Promotion"]
    },
    { 
      icon: Award, 
      name: "Sambalpuri Icon of the Year", 
      desc: "For promoters of Sambalpuri culture, including music, dance, and textiles.",
      example: "A fashion blogger showcasing Sambalpuri attire or a musician integrating Sambalpuri rhythms.",
      subcategories: ["Sambalpuri Music", "Sambalpuri Dance", "Sambalpuri Textiles"]
    },
    { 
      icon: TrendingUp, 
      name: "Rising Star of the Year", 
      desc: "For emerging creators making significant impacts with fresh perspectives and innovative content.",
      example: "A newcomer gaining rapid popularity through unique storytelling or creative visuals.",
      subcategories: ["New Creators", "Emerging Talent", "Fresh Perspectives"]
    },
    { 
      icon: Laugh, 
      name: "Best Comedy Creator", 
      desc: "For humorists delivering laughter through skits, stand-up, or satirical content.",
      example: "A comedian producing viral Odia sketches or a satirical news show.",
      subcategories: ["Skits", "Stand-up", "Impressions"]
    },
    { 
      icon: Music, 
      name: "Best Music Creator", 
      desc: "For musicians and composers innovating in covers, original compositions, and music production.",
      example: "An artist blending traditional Odia music with contemporary genres or producing original tracks.",
      subcategories: ["Covers", "Original Music", "Music Production"]
    },
    { 
      icon: Podcast, 
      name: "Podcast of the Year", 
      desc: "For podcasters delivering engaging content through interviews, storytelling, or educational series.",
      example: "A podcast exploring Odia history or discussing current social issues.",
      subcategories: ["Interviews", "Storytelling", "Educational"]
    },
    { 
      icon: Newspaper, 
      name: "Excellence in Digital Journalism", 
      desc: "For journalists and reporters showcasing fearless, innovative storytelling in digital news.",
      example: "An investigative series uncovering local issues or a digital platform providing in-depth news analysis.",
      subcategories: ["Investigative", "Feature Stories", "News Analysis"]
    },
    { 
      icon: Users, 
      name: "Digital News Leader", 
      desc: "For pioneers setting benchmarks for credible digital reporting and mobile journalism.",
      example: "A news outlet utilizing mobile platforms for real-time reporting or community-driven news initiatives.",
      subcategories: ["Breaking News", "Community Reporting", "Mobile Journalism"]
    },
    { 
      icon: Star, 
      name: "Creator of the Year", 
      desc: "For the ultimate content powerhouse inspiring audiences with quality, engagement, and innovation.",
      example: "A creator consistently producing high-impact content across multiple platforms.",
      subcategories: ["Content Quality", "Engagement", "Innovation"]
    },
    { 
      icon: Feather, 
      name: "Global Odia Creator Award", 
      desc: "For Odia creators making a significant impact beyond borders, bridging cultures worldwide.",
      example: "An Odia expatriate sharing cultural content internationally or collaborating with global influencers.",
      subcategories: ["International Reach", "Cross-cultural Content", "Diaspora Engagement"]
    },
    { 
      icon: Dumbbell, 
      name: "Best Sports/Fitness Influencer", 
      desc: "For creators who inspire strength, discipline, and wellness through fitness routines, sports achievements, or active lifestyle content.",
      example: "A fitness reel series on bodyweight workouts at home, a YouTube vlog documenting marathon prep, or motivational content on overcoming physical limitations.",
      subcategories: ["Fitness Training", "Sports Coverage", "Wellness Content"]
    },
    { 
      icon: Film, 
      name: "Best Digital Actor Creator", 
      desc: "For performers who breathe life into characters, sketches, and cinematic reels across digital platforms with charm and versatility.",
      example: "An Instagram series of monologues, short film-style skits exploring emotions, or humorous reels blending acting with trending audio clips.",
      subcategories: ["Character Acting", "Short Films", "Digital Skits"]
    },
    { 
      icon: Camera, 
      name: "Photographer of the Year", 
      desc: "For storytellers who freeze time through their lens, capturing Odisha's people, places, and moments with visual poetry.",
      example: "A photo essay on tribal life in Koraput, a candid street photography series from Cuttack, or surreal landscape captures from Satkosia gorge.",
      subcategories: ["Portrait Photography", "Landscape Photography", "Documentary Photography"]
    },
    { 
      icon: Gamepad2, 
      name: "Best Online Gamer", 
      desc: "For digital warriors and streamers who turn every game into a thrilling experience, blending skill, entertainment, and community engagement.",
      example: "A live-streamed PUBG battle royale, a YouTube series decoding Free Fire hacks, or hilarious reaction reels from intense BGMI showdowns.",
      subcategories: ["Live Streaming", "Game Commentary", "Gaming Tutorials"]
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" onClick={() => navigate(phaseState.isVotingPhase ? "/vote" : "/nominate")}>
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-[#ffb700] transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4" >
                <div className="p-3 bg-gray-800 rounded-lg text-[#ffb700] group-hover:bg-[#ffb700] group-hover:text-black transition-colors">
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{category.name}</h2>
                  <p className="text-gray-400 mt-1">{category.desc}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-300 italic">{category.example}</p>
              </div>
            </div>
          ))}
        </div>

         {/* Sponsors Section */}
       <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">OUR</span>
            <br />
            <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
              SPONSORS
            </span>
          </h2>

          {/* Platinum Sponsors */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Platinum Sponsors</h3>
            <div className="flex flex-wrap justify-center">
              {sponsors
                .filter((sponsor) => sponsor.tier === "platinum")
                .map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 p-6 rounded-xl flex flex-col items-center transition-transform hover:scale-105 m-4 w-full sm:w-[calc(50%-2rem)] md:w-[calc(33.333%-2rem)] lg:w-[calc(25%-2rem)] max-w-xs"
                  >
                    <div className="relative w-full h-32 mb-4">
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">{sponsor.name}</h4>
                    <div className="flex items-center text-[#ffb700] text-sm">
                      Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </a>
                ))}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div>
            <h3 className="text-2xl font-bold text-white text-center mb-8">Silver Sponsors</h3>
            <div className="flex flex-wrap justify-center">
              {sponsors
                .filter((sponsor) => sponsor.tier === "silver")
                .map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 p-6 rounded-xl flex flex-col items-center transition-transform hover:scale-105 m-4 w-full sm:w-[calc(50%-2rem)] md:w-[calc(33.333%-2rem)] lg:w-[calc(25%-2rem)] max-w-xs"
                  >
                    <div className="relative w-full h-32 mb-4">
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">{sponsor.name}</h4>
                    <div className="flex items-center text-[#ffb700] text-sm">
                      Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

        <div className="mt-16 text-center">
          {phaseState.loading ? (
            <LoadingState />
          ) : phaseState.error ? (
            <div className="text-red-500">{phaseState.error}</div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/nominate")}
                className="px-8 py-3 bg-[#e50914] hover:bg-[#ff5e00] text-white rounded-full cursor-pointer font-semibold"
              >
                Submit Your Nomination
              </button>
              <button
                onClick={() => navigate("/vote")}
                className="px-8 py-3 bg-[#ffb700] hover:bg-[#ffb700]/80 text-black rounded-full cursor-pointer font-semibold"
              >
                Cast Your Vote Now
              </button>
            </div>
          )}
        </div>
      </div>
      

    </div>
  );
}