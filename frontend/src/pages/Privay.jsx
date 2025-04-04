import React from 'react';
import { Shield, Lock, Mail, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            PRIVACY POLICY
          </span>
        </h1>

        <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl p-8 text-gray-300">
          <div className="space-y-8">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-[#ffb700] mr-3 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                <p className="mb-4">
                  Welcome to our Insight Event page! Your privacy is crucial to us. This Privacy Policy outlines how we collect, 
                  use, store, and protect your personal data when you participate in nominating and voting on our page.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">What Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Identification Information:</strong> Name, email address, and contact details when you register</li>
                <li><strong>Voting Data:</strong> Information related to your nominations and votes</li>
                <li><strong>Cookies and Usage Data:</strong> IP address, browser type, version, time spent on pages, and other diagnostic data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register you as a participant and enable nominating/voting</li>
                <li>Communicate event announcements, updates, and outcomes</li>
                <li>Improve and customize your experience</li>
                <li>Enforce terms and prevent fraud</li>
              </ul>
            </div>

            <div className="p-4 my-6 border border-blue-600 rounded-lg bg-blue-900 bg-opacity-20">
              <p className="flex items-center text-blue-200">
                <Lock className="h-5 w-5 mr-2 flex-shrink-0" /> 
                <span><strong>Data Protection:</strong> We implement security measures to maintain the safety of your personal information.</span>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Sharing of Information</h2>
              <p className="mb-4">
                We do not sell, trade, or transfer your personally identifiable information to outside parties, except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, provided they agree to keep this information confidential.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Your Data Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access and Update:</strong> Right to access and update your information</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention needs)</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent by contacting us</li>
              </ul>
            </div>

            <div className="p-4 my-6 border border-yellow-600 rounded-lg bg-yellow-900 bg-opacity-20">
              <p className="flex items-center text-yellow-200">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" /> 
                <span><strong>Third-Party Links:</strong> We may include third-party products/services with independent privacy policies.</span>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy periodically. We will notify you of changes by posting the new policy on this page.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="mb-2">
                For questions about this Privacy Policy:
              </p>
              <p className="flex items-center text-[#ffb700]">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:privacy@insightodisha.com" className="hover:underline">privacy@insightodisha.com</a>
              </p>
              <p className="mt-4 text-sm text-gray-400">
                <em>Last updated: June 2024</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}