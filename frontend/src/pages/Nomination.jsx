import { Link } from "react-router-dom";
import { Vote, Calendar, Trophy } from "lucide-react";

const NominationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card bg-gray-800/50 rounded-xl border border-gray-700 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-[#ffb700]/20 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-[#ffb700]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Nominations Closed – Voting Now Live!</h1>
              <div className="w-16 h-1 bg-gradient-to-r from-[#ffb700] to-[#ff5e00] mx-auto rounded-full mb-6"></div>
              <p className="text-gray-300 text-lg mb-8">
                The nomination period has officially ended. While entries are now closed, you can still support your favourite content creators.
              </p>
              </div>

            <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="w-16 h-16 bg-[#ffb700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Vote className="h-8 w-8 text-[#ffb700]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold text-white mb-2">Head to the Vote section and cast your vote today:</h2>
                  <p className="text-gray-300 mb-4">Your vote can help decide who takes home the spotlight!</p>
                  <Link 
                    to="/vote" 
                    className="inline-block px-8 py-3 bg-[#ffb700] text-black rounded-lg font-bold hover:bg-[#ff5e00] transition-colors"
                  >
                    Vote Now
                  </Link>
                </div>
              </div>
                    </div>

            <div className="bg-gradient-to-r from-[#ffb700]/10 to-[#ff5e00]/10 rounded-lg border border-[#ffb700]/20 p-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="w-12 h-12 bg-[#ffb700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-6 w-6 text-[#ffb700]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Event Coming Soon</h3>
                  <p className="text-gray-300">
                    Winners will be announced at our awards ceremony on <span className="text-[#ffb700] font-semibold">3rd May 2025</span>. 
                    Stay tuned for updates on our social media channels!
                  </p>
                </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NominationPage;