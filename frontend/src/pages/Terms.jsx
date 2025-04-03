import React from 'react';
import { Shield, FileText, Lock, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            TERMS & CONDITIONS
          </span>
        </h1>

        <div className="max-w-4xl mx-auto text-gray-300 space-y-8 text-lg">
          <section className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FileText className="h-6 w-6 text-[#ffb700] mr-3" />
              General Terms
            </h2>
            <div className="space-y-4">
              <p>
                Welcome to OTV Vote. By accessing or using our platform, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations.
              </p>
              <p>
                OTV Vote reserves the right to modify these terms at any time, and such modifications shall be effective immediately upon posting on this platform. Your continued use of the platform will be deemed your acceptance of the modified terms.
              </p>
              <p>
                The platform is intended for users who are at least 18 years of age. By using this platform, you represent and warrant that you are at least 18 years old and able to form legally binding contracts under applicable law.
              </p>
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="h-6 w-6 text-[#ffb700] mr-3" />
              User Accounts
            </h2>
            <div className="space-y-4">
              <p>
                To participate in voting or nominations, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              <p>
                You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                OTV Vote reserves the right to suspend or terminate your account if any information provided proves to be inaccurate, not current, or incomplete, or if we suspect misuse of your account.
              </p>
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Lock className="h-6 w-6 text-[#ffb700] mr-3" />
              Payment Terms
            </h2>
            <div className="space-y-4">
              <p>
                Some features of OTV Vote may require payment. All payments are processed securely through Razorpay, our payment gateway partner.
              </p>
              <p>
                By making a payment, you represent and warrant that you are authorized to use the designated payment method and authorize us to charge your payment method for the total amount of your transaction.
              </p>
              <p>
                Payment information is encrypted and securely stored by Razorpay in compliance with PCI DSS standards. OTV Vote does not store your complete payment information on our servers.
              </p>
              <p>
                All payments are final and non-refundable unless otherwise specified in our Refund Policy or required by applicable law.
              </p>
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 text-[#ffb700] mr-3" />
              Limitation of Liability
            </h2>
            <div className="space-y-4">
              <p>
                In no event shall OTV Vote, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any errors, mistakes, or inaccuracies of content.
              </p>
              <p>
                OTV Vote does not guarantee the accuracy, completeness, or usefulness of any information on the platform and will not be responsible for any losses or damages that may result from your use of the platform.
              </p>
              <p>
                By using OTV Vote, you agree to indemnify, defend, and hold harmless OTV Vote and its affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees arising from your use of the platform or violation of these Terms.
              </p>
            </div>
          </section>

          <p className="text-center mt-10">
            Last updated: April 3, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
