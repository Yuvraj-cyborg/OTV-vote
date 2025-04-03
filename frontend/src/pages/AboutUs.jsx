import React from 'react';
import { Info, Award, Users, Globe } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            ABOUT US
          </span>
        </h1>

        <div className="max-w-4xl mx-auto text-gray-300 space-y-6 text-lg">
          <p>
            OTV Vote is Odisha's premier digital voting platform, dedicated to amplifying voices and celebrating excellence across the state. Founded in 2022, we've quickly established ourselves as the go-to platform for recognizing talent and innovation.
          </p>
          <p>
            Our mission is to create a transparent, accessible, and engaging platform that connects the people of Odisha with opportunities to recognize and celebrate excellence in various fields. We believe in the power of community-driven recognition.
          </p>
          <p>
            What sets us apart:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Transparent voting processes with state-of-the-art security measures</li>
            <li>Partnership with Odisha's leading media outlets for maximum visibility</li>
            <li>A commitment to showcasing talent from all corners of Odisha</li>
            <li>Continuous innovation in digital engagement and participation</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {[
            { icon: Info, title: "Our Vision", description: "To become the most trusted platform for digital recognition in Eastern India" },
            { icon: Users, title: "Our Team", description: "A passionate group of tech innovators and media professionals" },
            { icon: Award, title: "Our Impact", description: "Over 500,000 votes cast across various campaigns since inception" },
            { icon: Globe, title: "Our Reach", description: "Connecting talent from across Odisha with global opportunities" }
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
