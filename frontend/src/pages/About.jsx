import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPhaseState } from "../api";
import { useState, useEffect } from 'react';
import { Trophy, Users, Award, Star,ExternalLink } from 'lucide-react';
import sponsors from '../sponsors'

export default function About() {
  const navigate = useNavigate();
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
              ABOUT INSIGHT 2025
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Celebrating Influence. Honoring Identity.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <p className="text-lg text-white leading-relaxed">
              In a world where likes, shares, and reels shape narratives, Insight – 2025 is Odisha's first platform dedicated to recognizing the creators who are redefining culture, storytelling, and identity in the digital age.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#ffb700] mb-4">Our Vision</h2>
            <p className="text-lg text-white leading-relaxed">
              A first-of-its-kind, multi-platform award show, Insight – 2025 celebrates Odisha's most influential and impactful digital voices. Designed to honor, amplify, and elevate the creators shaping the state's evolving digital landscape.
            </p>
            <p className="text-lg text-white leading-relaxed mt-4">
              Anchored in the spirit of Odia Asmita, this landmark edition honors social media influencers who've become the digital ambassadors of our heritage — whether through language, art, fashion, food, music, or activism.
            </p>
          </div>

          {/* Core Message */}
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#ffb700] mb-4">Our Core Message</h2>
            <p className="text-lg text-white leading-relaxed">
              They don't just post; they preserve.
              <br />
              They don't just trend; they transform.
            </p>
            <p className="text-lg text-white leading-relaxed mt-4">
              From grassroots creators with local dialects to polished urban voices celebrating Odisha on global platforms, this award is not about follower counts — it's about impact.
            </p>
          </div>

          {/* Powered By */}
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#ffb700] mb-4">Powered by OTV</h2>
            <p className="text-lg text-white leading-relaxed">
              Hosted by OTV, the largest media network in Odisha, Insight – 2025 is a high-energy, community-driven celebration of creativity, influence, and digital pride. With a transparent self/public nomination and voting process, it gives every creator — no matter where they come from — the opportunity to be recognized as a Digital Odia Icon.
            </p>
          </div>

          {/* Why It Matters */}
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#ffb700] mb-4">Why It Matters</h2>
            <p className="text-lg text-white leading-relaxed">
              For too long, creators from our region have shaped powerful conversations but remained under-recognized on national and global stages. Insight – 2025 seeks to change that — by celebrating originality, authenticity, and the power of rooted storytelling.
            </p>
            <p className="text-lg text-white leading-relaxed mt-4">
              Because when the world scrolls, we want them to stop — and see Odisha.
            </p>
          </div>

          {/* What We Look For */}
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#ffb700] mb-4">What We Look For</h2>
            <p className="text-lg text-white mb-4">We recognize creators who:</p>
            <ul className="space-y-3 text-white">
              <li className="flex items-start">
                <span className="text-[#ffb700] mr-2">•</span>
                Elevate Odia identity through digital storytelling
              </li>
              <li className="flex items-start">
                <span className="text-[#ffb700] mr-2">•</span>
                Blend tradition with innovation
              </li>
              <li className="flex items-start">
                <span className="text-[#ffb700] mr-2">•</span>
                Inspire communities and provoke thought
              </li>
              <li className="flex items-start">
                <span className="text-[#ffb700] mr-2">•</span>
                Use their platform with purpose and responsibility
              </li>
            </ul>
            <p className="text-lg text-white mt-4">
              Whether you're a travel vlogger capturing hidden Odisha, a comic sharing culturally rooted satire, a craftsperson teaching ancient techniques online, or a fashion creator reviving traditional weaves — this is your stage.
            </p>
          </div>

          {/* Experience */}
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-[#ffb700] mb-4">More Than Awards — It's an Experience</h2>
            <p className="text-lg text-white mb-4">
              Insight – 2025 is about learning, growing, and breaking barriers in the digital space. Attendees will gain access to:
            </p>
            <ul className="space-y-3 text-white">
              <li className="flex items-start">
                <span className="text-[#ffb700] mr-2">•</span>
                A chance to network with Odisha's most influential digital personas
              </li>
              <li className="flex items-start">
                <span className="text-[#ffb700] mr-2">•</span>
                One-on-one conversations with renowned national celebrities and thought leaders
              </li>
              <li className="flex items-start">
                <span className="text-[#ffb700] mr-2">•</span>
                Live performances, stand-up comedy, and world-class entertainment
              </li>
            </ul>
          </div>

          {/* Final Message */}
          <div className="bg-gray-900/50 p-8 rounded-xl text-center">
            <p className="text-lg text-white italic">
              This isn't just an event. It's a movement.
              <br />
              This is where culture meets content. Influence meets purpose. And Odisha meets the world.
              <br />
              Welcome to Insight – 2025.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate(phaseState.isVotingPhase ? "/vote" : "/nominate")}
              className="px-8 py-3 bg-[#e50914] hover:bg-[#ff5e00] text-white rounded-full cursor-pointer font-semibold"
            >
              {phaseState.isVotingPhase ? "Cast Your Vote Now" : "Submit Your Nomination"}
            </button>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {[
            { icon: Trophy, title: "Community-Driven", description: "Public nomination & voting process for authentic recognition" },
            { icon: Users, title: "Networking", description: "Connect with Odisha's top digital creators and brands" },
            { icon: Award, title: "Recognition", description: "Get recognized by Odisha's largest media network" },
            { icon: Star, title: "Growth", description: "Learn from industry leaders and elevate your craft" }
          ].map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <item.icon className="h-12 w-12 text-[#ffb700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}