'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaInstagram, FaFacebookF, FaClock } from 'react-icons/fa';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ContactContent() {
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
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Nous sommes là pour vous aider avec toutes vos questions sur nos produits ou services.
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
              <h2 className="text-2xl font-playfair text-gray-800 mb-6">Envoyez-nous un message</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                  Merci pour votre message ! Nous vous répondrons bientôt.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Votre nom *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de téléphone
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
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="Product Inquiry">Question sur un produit</option>
                      <option value="Order Status">Statut de commande</option>
                      <option value="Wholesale">Demande de vente en gros</option>
                      <option value="Feedback">Commentaires</option>
                      <option value="Other">Autre</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Votre message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8a45d] focus:border-[#c8a45d] transition"
                    placeholder="Comment pouvons-nous vous aider ?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-md bg-[#c8a45d] text-white font-medium transition 
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#c8a45d]/90'}`}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-playfair text-gray-800 mb-6">Informations de contact</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-[#f9f5eb] p-3 rounded-full mr-4">
                      <FaMapMarkerAlt className="w-5 h-5 text-[#c8a45d]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Localisation du magasin</h3>
                      <p className="text-gray-600">
                        123 Rue Mohammed V<br />
                        Casablanca, 20250<br />
                        Maroc
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-[#f9f5eb] p-3 rounded-full mr-4">
                      <FaPhoneAlt className="w-5 h-5 text-[#c8a45d]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Téléphone</h3>
                      <p className="text-gray-600">
                        <a href="tel:+212674428593" className="hover:text-[#c8a45d] transition-colors">
                          +212 674428593
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
                      <h3 className="text-lg font-medium text-gray-800 mb-1">Heures d'ouverture</h3>
                      <p className="text-gray-600">
                        Lundi - Vendredi : 9h00 - 20h00<br />
                        Samedi : 10h00 - 18h00<br />
                        Dimanche : Fermé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-playfair text-gray-800 mb-4">Suivez-nous</h3>
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
                    href="https://wa.me/212674428593" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f9f5eb] flex items-center justify-center hover:bg-[#c8a45d] hover:text-white transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-playfair text-gray-800 mb-4">Commande rapide</h3>
                <p className="text-gray-600 mb-4">
                  Pour les commandes rapides, contactez-nous directement sur WhatsApp. Nous répondrons en quelques minutes !
                </p>
                <a
                  href="https://wa.me/212674428593?text=Bonjour, je souhaite passer une commande."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white rounded-md hover:bg-[#22c55e] transition-colors"
                >
                  <FaWhatsapp className="mr-2 w-5 h-5" />
                  Commander sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-playfair text-center text-gray-800 mb-8">Nous trouver</h2>
            <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Carte de localisation bientôt disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-playfair text-center text-gray-800 mb-8">Questions fréquemment posées</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "Comment puis-je suivre ma commande ?",
                  answer: "Une fois votre commande expédiée, vous recevrez un numéro de suivi via WhatsApp ou email. Vous pouvez utiliser ce numéro pour suivre le statut de votre colis et la date de livraison estimée."
                },
                {
                  question: "Quelle est votre politique de retour ?",
                  answer: "Nous acceptons les retours dans les 14 jours suivant la livraison si le produit n'est pas utilisé et dans son emballage d'origine. Veuillez contacter notre équipe de service client pour initier un retour."
                },
                {
                  question: "Livrez-vous à l'international ?",
                  answer: "Oui, nous livrons à l'international dans certains pays sélectionnés. Les frais de port et les délais de livraison varient selon la localisation. Veuillez nous contacter pour des détails spécifiques sur la livraison dans votre pays."
                },
                {
                  question: "Vos parfums sont-ils sans cruauté ?",
                  answer: "Oui, tous nos produits sont sans cruauté. Nous ne testons pas nos parfums sur les animaux et nous travaillons avec des fournisseurs qui partagent notre engagement envers des pratiques éthiques."
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