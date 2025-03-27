import { useEffect, useState } from "react";
import { fetchProfileDetails } from "../api";

const NomineeCard = () => {
  const [nominations, setNominations] = useState([]);

  useEffect(() => {
    const getNominations = async () => {
      try {
        const response = await fetchProfileDetails();
        setNominations(response.data);
      } catch (error) {
        console.error("Error fetching nominations:", error);
      }
    };

    getNominations();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {nominations.map((nominee, index) => (
        <div
          key={index}
          className="rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-900 flex flex-col items-center text-center"
        >
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
            <img
              src={nominee.nomineePhoto}
              alt={nominee.nomineeName}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold mt-4 text-gray-900 dark:text-white">
            {nominee.nomineeName}
          </h2>
          <p className="text-sm text-gray-500">{nominee.nomineeEmail}</p>

          <div className="flex space-x-4 mt-3">
            {nominee.instagramUrl && (
              <a href={nominee.instagramUrl} target="_blank" rel="noopener noreferrer">
              </a>
            )}
            {nominee.facebookId && (
              <a href={`https://facebook.com/${nominee.facebookId}`} target="_blank" rel="noopener noreferrer">
              </a>
            )}
            {nominee.xId && (
              <a href={`https://twitter.com/${nominee.xId}`} target="_blank" rel="noopener noreferrer">
              </a>
            )}
            {nominee.youtubeId && (
              <a href={`https://youtube.com/${nominee.youtubeId}`} target="_blank" rel="noopener noreferrer">
              </a>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {nominee.categories.map((category, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NomineeCard;
