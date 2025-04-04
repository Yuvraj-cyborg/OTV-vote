import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function PriceDetail() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            PRICING DETAILS
          </span>
        </h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Nomination Fee
            </h2>
            
            <div className="text-center mb-8">
              <p className="text-5xl font-bold text-white mb-2">₹300</p>
              <p className="text-gray-400">per nomination</p>
            </div>
            
            <div className="text-gray-300 space-y-4 max-w-2xl mx-auto">
              <p>
                A single nomination fee of ₹299 applies to all participants. This fee provides full access to our secure voting platform, complete profile visibility, and eligibility for event participation.
              </p>
              
              <div className="p-4 my-6 border border-yellow-600 rounded-lg bg-yellow-900 bg-opacity-20">
                <p className="flex items-center text-yellow-200">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" /> 
                  <span><strong>Important:</strong> All payments are final and non-refundable. Please ensure your nomination details are correct before completing your payment.</span>
                </p>
              </div>
              
              <p>
                Participants may enter multiple categories, but each category nomination requires a separate payment of ₹300.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <h3 className="font-bold text-white mb-2 text-lg">When will I be charged?</h3>
                <p className="text-gray-300">
                  Your payment of ₹300 will be processed immediately upon submission of your nomination. You will receive an email receipt for confirmation.
                </p>
              </div>
              
              <div className="border-b border-gray-800 pb-4">
                <h3 className="font-bold text-white mb-2 text-lg">Is there a refund policy?</h3>
                <p className="text-gray-300">
                  <strong>All payments are final and non-refundable</strong> once processed. If you have any issues with your nomination, please contact our support team at odishatvotv@gmail.com.
                </p>
              </div>
              
              <div className="border-b border-gray-800 pb-4">
                <h3 className="font-bold text-white mb-2 text-lg">Are my payment details secure?</h3>
                <p className="text-gray-300">
                  Yes, we use industry-standard secure payment processing. Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
              
              <div className="border-b border-gray-800 pb-4">
                <h3 className="font-bold text-white mb-2 text-lg">Can I nominate in multiple categories?</h3>
                <p className="text-gray-300">
                  Yes, you can submit nominations for multiple categories, but each nomination requires a separate payment of ₹300.
                </p>
              </div>
              
              <div className="pb-2">
                <h3 className="font-bold text-white mb-2 text-lg">What does my nomination fee include?</h3>
                <p className="text-gray-300">
                  Your nomination fee includes processing of your nomination, profile visibility on our platform, eligibility for public voting, and potential recognition at our awards ceremony.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
