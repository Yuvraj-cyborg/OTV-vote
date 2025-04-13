import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { fetchApprovedNominees } from '../api';
import NomineeModal from './NomineeModal';

const NomineeCarousel = () => {
  const [nominees, setNominees] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNominee, setSelectedNominee] = useState(null);

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const response = await fetchApprovedNominees();
        if (Array.isArray(response)) {
          setNominees(response);
        } else {
          setNominees([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nominees:', error);
        setError('Failed to load nominees');
        setLoading(false);
      }
    };

    fetchNominees();
  }, []);

  const nextSlide = () => {
    if (nominees.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === nominees.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (nominees.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? nominees.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffb700]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!nominees || nominees.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-400 text-sm">No nominees available yet</p>
      </div>
    );
  }

  const NomineeCard = ({ nominee }) => (
    <div className="bg-black/50 rounded-lg border border-gray-700 overflow-hidden w-full mx-auto" style={{ maxWidth: '280px' }}>
      <div className="aspect-square relative">
        <img
          src={nominee.nomineePhoto || "https://via.placeholder.com/150"}
          alt={nominee.nomineeName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-nominee.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={() => {
            setSelectedNominee(nominee);
            window.scrollTo(0, 0);
          }}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-[#ffb700]/20"
        >
          <Info className="w-4 h-4 text-white" />
        </button>
        <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
          <h3 className="font-bold text-white text-sm md:text-base">{nominee.nomineeName}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full">
        {/* Desktop Grid View */}
        <div className="hidden md:flex flex-wrap justify-center gap-4 md:gap-6 px-4">
          {nominees.map((nominee) => (
            <div key={nominee.id} className="flex justify-center w-full" style={{ maxWidth: '280px' }}>
              <NomineeCard nominee={nominee} />
            </div>
          ))}
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden relative w-full">
          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${nominees.length * 100}%`,
              }}
            >
              {nominees.map((nominee) => (
                <div
                  key={nominee.id}
                  className="flex-shrink-0 w-full px-2"
                  style={{ width: '100%' }}
                >
                  <div className="flex justify-center">
                    <NomineeCard nominee={nominee} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {nominees.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full transition shadow-md hover:bg-[#ffb700]/80"
                aria-label="Previous nominee"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full transition shadow-md hover:bg-[#ffb700]/80"
                aria-label="Next nominee"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex justify-center mt-4 space-x-2">
                {nominees.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-[#ffb700]' : 'bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedNominee && (
        <NomineeModal 
          nominee={selectedNominee} 
          onClose={() => setSelectedNominee(null)} 
        />
      )}
    </>
  );
};

export default NomineeCarousel;