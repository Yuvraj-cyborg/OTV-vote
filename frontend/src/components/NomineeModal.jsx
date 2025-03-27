import React from "react";

const NomineeModal = ({ nominee, onClose }) => {
  if (!nominee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{nominee.nomineeName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 mx-auto">
            <img
              src={nominee.nomineePhoto}
              alt={nominee.nomineeName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-500 text-center">{nominee.nomineeEmail}</p>
          <div className="flex space-x-4 justify-center">
            {nominee.instagramUrl && (
              <a href={nominee.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {nominee.facebookId && (
              <a href={`https://facebook.com/${nominee.facebookId}`} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
            {nominee.xId && (
              <a href={`https://twitter.com/${nominee.xId}`} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            )}
            {nominee.youtubeId && (
              <a href={`https://youtube.com/${nominee.youtubeId}`} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {nominee.categories.map((category, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomineeModal;