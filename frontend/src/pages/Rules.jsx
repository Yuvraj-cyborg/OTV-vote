import React from "react";
import { CalendarDays, ClipboardCheck, Users, Award, Bell, Banknote, AlertCircle } from "lucide-react";

export default function Rules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Nomination, Voting & Result Guidelines
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
              To ensure a fair and transparent selection process for the OTV Insight Digital Creator Awards, 
              please go through the following key guidelines:
            </p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-[#ffb700] to-[#ff5e00] mx-auto rounded-full"></div>
          </div>

          {/* Guidelines Sections */}
          <div className="space-y-8 md:space-y-12">
            {/* Nomination Phase */}
            <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700 transform transition-all hover:scale-[1.01] hover:border-[#ffb700]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffb700]/20 flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-[#ffb700]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span>1. Nomination Phase</span>
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Nominations will remain open until <span className="text-[#ffb700] font-semibold">18th April 2025</span>.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Once a nomination is submitted, it will undergo a verification and approval process by our internal team.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Upon approval, the nominee will receive a Nomination Card which they can share on social media by tagging and collaborating with our official Instagram handle <span className="text-[#ffb700] font-semibold">@insightbyotv</span>.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Voting Phase */}
            <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700 transform transition-all hover:scale-[1.01] hover:border-[#ffb700]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffb700]/20 flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-[#ffb700]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span>2. Voting Phase</span>
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Approved nominees can encourage their followers to vote for them by visiting: <a href="https://www.otvinsight.com/vote" className="text-[#ffb700] underline hover:text-[#ff5e00]">www.otvinsight.com/vote</a>.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Voting will be open from the date of approval until <span className="text-[#ffb700] font-semibold">28th April 2025</span>.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Each user can cast one vote per category.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Jury Evaluation */}
            <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700 transform transition-all hover:scale-[1.01] hover:border-[#ffb700]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffb700]/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#ffb700]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span>3. Jury Evaluation</span>
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>After the voting period ends, shortlisted nominees will undergo a final round of evaluation by our expert jury panel.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>The jury's decision will be final and binding.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Announcement of Results */}
            <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700 transform transition-all hover:scale-[1.01] hover:border-[#ffb700]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffb700]/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#ffb700]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span>4. Announcement of Results</span>
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Winners will be revealed on the day of the awards ceremony – <span className="text-[#ffb700] font-semibold">3rd May 2025</span>.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>All winners will receive trophies, while nominees will be felicitated with participation certificates and exclusive goodies.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Post-Event Updates */}
            <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700 transform transition-all hover:scale-[1.01] hover:border-[#ffb700]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffb700]/20 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-[#ffb700]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span>5. Post-Event Updates</span>
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>Results and highlights will be published on our official website and Instagram page after the event.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ffb700] mt-2 mr-3 flex-shrink-0"></span>
                      <p>For any queries, feel free to reach out via <a href="mailto:insight@odishatv.com" className="text-[#ffb700] underline hover:text-[#ff5e00]">insight@odishatv.com</a>.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key Information Box */}
          <div className="mt-12 bg-gradient-to-r from-[#ffb700]/20 to-[#ff5e00]/20 rounded-xl p-6 md:p-8 border border-[#ffb700]/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 mr-2 text-[#ffb700]" />
              <span>Key Information</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffb700]/30 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-[#ffb700]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Entry Fee</h3>
                  <p className="text-gray-300">₹299 per nomination</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffb700]/30 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-[#ffb700]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Nomination Deadline</h3>
                  <p className="text-gray-300">18th April 2025</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffb700]/30 flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-[#ffb700]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Inclusions</h3>
                  <p className="text-gray-300">Voting platform access, full creator profile visibility, and event eligibility.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffb700]/30 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-[#ffb700]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Refund Policy</h3>
                  <p className="text-gray-300">Entry fees are non-refundable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 