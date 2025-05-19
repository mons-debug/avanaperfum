'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaInstagram, FaFacebookF, FaClock } from 'react-icons/fa';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real application, you would send this data to your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#f9f5eb] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-playfair text-[#c8a45d] mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              We're here to help with any questions about our products or services.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white clip-path-wave"></div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-playfair text-gray-800 mb-6">Send Us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                  Thank you for your message! We will get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  There was an error sending your message. Please try again.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                    >
                      <option value="">Select a subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Wholesale">Wholesale Inquiry</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-md bg-[#c8a45d] text-white font-medium transition 
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#c8a45d]/90'}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-playfair text-gray-800 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-[#f9f5eb] p-3 rounded-full mr-4">
                      <FaMapMarkerAlt className="w-5 h-5 text-[#c8a45d]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Store Location</h3>
                      <p className="text-gray-600">
                        123 Rue Mohammed V<br />
                        Casablanca, 20250<br />
                        Morocco
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-[#f9f5eb] p-3 rounded-full mr-4">
                      <FaPhoneAlt className="w-5 h-5 text-[#c8a45d]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Phone</h3>
                      <p className="text-gray-600">
                        <a href="tel:+212522123456" className="hover:text-[#c8a45d] transition-colors">
                          +212 522 123 456
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-[#f9f5eb] p-3 rounded-full mr-4">
                      <FaEnvelope className="w-5 h-5 text-[#c8a45d]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:info@avanaparfum.com" className="hover:text-[#c8a45d] transition-colors">
                          info@avanaparfum.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-[#f9f5eb] p-3 rounded-full mr-4">
                      <FaClock className="w-5 h-5 text-[#c8a45d]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 8:00 PM<br />
                        Saturday: 10:00 AM - 6:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-playfair text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/avanaparfum" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f9f5eb] flex items-center justify-center hover:bg-[#c8a45d] hover:text-white transition-colors"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://facebook.com/avanaparfum" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f9f5eb] flex items-center justify-center hover:bg-[#c8a45d] hover:text-white transition-colors"
                  >
                    <FaFacebookF className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://wa.me/+212XXXxxxXXX" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f9f5eb] flex items-center justify-center hover:bg-[#c8a45d] hover:text-white transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-playfair text-gray-800 mb-4">Quick Order</h3>
                <p className="text-gray-600 mb-4">
                  For fast orders, contact us directly on WhatsApp. We'll respond within minutes!
                </p>
                <a
                  href="https://wa.me/+212XXXxxxXXX?text=Hello, I would like to place an order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white rounded-md hover:bg-[#22c55e] transition-colors"
                >
                  <FaWhatsapp className="mr-2 w-5 h-5" />
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-playfair text-center text-gray-800 mb-8">Visit Our Store</h2>
          <div className="rounded-xl overflow-hidden shadow-md h-96 relative">
            {/* Replace with actual Google Maps embed in production */}
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-600">
                Google Maps will be embedded here. For privacy reasons, it's not loaded in development mode.
              </p>
            </div>
            
            {/* Uncomment in production: */}
            {/* <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8064081218937!2d-7.6193!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNycwOS41Ilc!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe> */}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-playfair text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "How can I track my order?",
                  answer: "Once your order is shipped, you will receive a tracking number via WhatsApp or email. You can use this number to track your package's status and estimated delivery date."
                },
                {
                  question: "What is your return policy?",
                  answer: "We accept returns within 14 days of delivery if the product is unused and in its original packaging. Please contact our customer service team to initiate a return."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes, we ship internationally to select countries. Shipping fees and delivery times vary by location. Please contact us for specific details about shipping to your country."
                },
                {
                  question: "Are your fragrances cruelty-free?",
                  answer: "Yes, all our products are cruelty-free. We do not test our fragrances on animals and we work with suppliers who share our commitment to ethical practices."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      <style jsx>{`
        .clip-path-wave {
          clip-path: url(#wave);
          max-width: 100%;
          left: 0;
          right: 0;
        }
      `}</style>

      <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
        <defs>
          <clipPath id="wave" clipPathUnits="objectBoundingBox">
            <path d="M0,0.7 C0.3,0.9 0.7,0.5 1,0.7 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </main>
  );
}
