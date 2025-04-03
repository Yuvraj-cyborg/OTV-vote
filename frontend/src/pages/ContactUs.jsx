import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create email body with form data
    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
    `;
    
    // Encode for URL
    const encodedSubject = encodeURIComponent(formData.subject || 'Contact from OTV Vote Website');
    const encodedBody = encodeURIComponent(emailBody);
    
    // Redirect to Gmail compose
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=odishatvotv@gmail.com&su=${encodedSubject}&body=${encodedBody}`;
  };

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#ffb700] via-[#e50914] to-[#ffb700] bg-clip-text text-transparent">
            CONTACT US
          </span>
        </h1>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-900 rounded-xl p-8 text-gray-300">
            <p className="text-xl mb-8 text-center">
              Have questions or feedback? We'd love to hear from you. Contact our team using any of the methods below.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-[#ffb700] mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p>odishatvotv@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-[#ffb700] mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Phone</h3>
                    <p>+91 70633 90994</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-[#ffb700] mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Address</h3>
                    <p>OTV Headquarters</p>
                    <p>Plot No. 123, Bhubaneswar</p>
                    <p>Odisha, 751001, India</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-[#ffb700] mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Social Media</h3>
                    <p>Twitter: @OTVVote</p>
                    <p>Instagram: @otvvoteofficial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Send Us a Message</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700]" 
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700]" 
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-300 mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700]" 
                  placeholder="Message subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700]" 
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-center">
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-gradient-to-r from-[#ffb700] to-[#e50914] rounded-lg text-white font-bold hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
