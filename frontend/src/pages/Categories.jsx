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
  Award
} from 'lucide-react';

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
    }
  ];

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
                <h3 className="text-sm font-semibold text-[#ffb700] mb-2">SUBCATEGORIES</h3>
                <ul className="space-y-2">
                  {category.subcategories.map((subcat, i) => (
                    <li key={i} className="flex items-center text-gray-300 hover:text-white">
                      <ChevronRight className="h-4 w-4 mr-2 text-[#ffb700]" />
                      {subcat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(`/categories/${category.name.toLowerCase().replace(/ /g, "-")}`)}
                className="mt-6 w-full py-2 bg-transparent border border-[#ffb700] text-[#ffb700] rounded-lg hover:bg-[#ffb700] hover:text-black transition-colors flex items-center justify-center"
              >
                <Award className="h-4 w-4 mr-2" />
                View Nominees
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/nominate')}
            className="px-8 py-3 bg-[#ffb700] text-black rounded-full font-bold hover:bg-[#ffa600] transition-colors inline-flex items-center"
          >
            Submit Your Nomination
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}