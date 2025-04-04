import React from 'react';
import { AlertTriangle, Mail } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            REFUND POLICY
          </span>
        </h1>

        <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl p-8 text-gray-300">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">No Refund Policy</h2>
              <p className="mb-4">
                INSIGHT 2025 operates on a strict no-refund policy for all nomination fees. The ₹299 nomination fee paid for 
                each category entry is non-refundable under any circumstances.
              </p>
              
              <div className="p-4 my-6 border border-yellow-600 rounded-lg bg-yellow-900 bg-opacity-20">
                <p className="flex items-center text-yellow-200">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" /> 
                  <span><strong>Important:</strong> All payments are final and non-refundable once processed. Please ensure your nomination details are correct before completing your payment.</span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Reasons for No-Refund Policy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nomination fees contribute to the administrative costs of reviewing and processing entries</li>
                <li>Each submission requires dedicated resources for verification and evaluation</li>
                <li>The event planning and organization continues regardless of individual participation</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="mb-2">
                If you have any questions about our refund policy, please contact us at:
              </p>
              <p className="flex items-center text-[#ffb700]">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:insight@odishatv.com" className="hover:underline">insight@odishatv.com</a>
              </p>
              <p className="mt-4">
                While we cannot process refunds, our team is available to assist with any questions or concerns regarding your nomination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
