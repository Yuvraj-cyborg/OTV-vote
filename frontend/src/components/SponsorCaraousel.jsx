import React from 'react';

const SponsorCarousel = ({ sponsors }) => {
  return (
    <div className="bg-black py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          <span className="text-white">OUR </span>
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            SPONSORS
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full h-20 bg-gray-800 rounded-lg flex items-center justify-center p-4">
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-white mt-4 text-center">{sponsor.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SponsorCarousel.defaultProps = {
  sponsors: [
    { name: "OTV Network", logo: "https://via.placeholder.com/150x80?text=OTV" },
    { name: "Tech Odisha", logo: "https://via.placeholder.com/150x80?text=Tech+Odisha" },
    { name: "Digital Bhubaneswar", logo: "https://via.placeholder.com/150x80?text=Digital+BBSR" },
    { name: "Creators Guild", logo: "https://via.placeholder.com/150x80?text=Creators+Guild" }
  ]
};

export default SponsorCarousel;