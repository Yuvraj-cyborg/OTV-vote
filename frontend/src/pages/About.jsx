import React from 'react';
import { Trophy, Users, Award, Star,ExternalLink } from 'lucide-react';
import sponsors from '../sponsors'

export default function About() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            ABOUT INSIGHT 2025
          </span>
        </h1>

        <div className="max-w-4xl mx-auto text-gray-300 space-y-6 text-lg">
          <p>
            INSIGHT 2025 is a first-of-its-kind, multi-platform award show celebrating Odisha's most influential and impactful digital voices. Designed to honor, amplify, and elevate the creators shaping the state's evolving digital landscape.
          </p>
          <p>
            Hosted by OTV, Odisha's largest media network, INSIGHT 2025 is a high-energy, community-driven celebration of creativity, influence, and impact. With a self/public nomination & voting process, we bring you the opportunity to be recognised as a Digital Odia Icon.
          </p>
          <p>
            The event is about learning, growing, and breaking barriers in the digital space. Attendees will get exclusive access to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A unique chance to network with the most influential digital personas of Odisha</li>
            <li>One-on-one conversations with renowned national celebrities and thought leaders</li>
            <li>Live performances, stand-up comedy, and entertainment</li>
          </ul>
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