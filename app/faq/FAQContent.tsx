'use client';

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function FAQContent() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: 'Comment puis-je commander des parfums AVANA ?',
      answer:
        'Vous pouvez commander nos parfums directement sur notre site web en ajoutant les produits à votre panier et en suivant le processus de paiement. Vous pouvez également nous contacter via WhatsApp au +212 674428593 pour passer une commande ou obtenir plus d\'informations.'
    },
    {
      question: 'Quels sont les délais de livraison ?',
      answer:
        'Nous livrons généralement au Maroc dans un délai de 3 à 5 jours ouvrables. Pour les commandes internationales, le délai peut varier entre 7 et 14 jours ouvrables selon la destination.'
    },
    {
      question: 'Les parfums AVANA sont-ils semblables aux parfums de marque ?',
      answer:
        'Nos parfums sont inspirés des fragrances de luxe mais ne sont pas des copies exactes. Nous créons nos propres formulations pour capturer l\'essence des parfums haut de gamme tout en offrant une excellente qualité à un prix accessible.'
    },
    {
      question: 'Quelle est la durée de tenue des parfums AVANA ?',
      answer:
        'Nos parfums ont une excellente tenue, généralement entre 6 et 8 heures selon le type de parfum et votre type de peau. Nos eaux de parfum ont une concentration plus élevée pour une meilleure longévité.'
    },
    {
      question: 'Puis-je retourner un produit si je ne suis pas satisfait ?',
      answer:
        'Oui, nous acceptons les retours dans les 14 jours suivant la réception si le produit n\'a pas été ouvert ou utilisé. Veuillez consulter notre politique de retour pour plus de détails.'
    },
    {
      question: 'AVANA propose-t-il des échantillons ?',
      answer:
        'Oui, nous proposons des coffrets d\'échantillons qui vous permettent de découvrir nos fragrances avant de vous engager pour un flacon complet. Visitez notre page Coffrets pour plus d\'informations.'
    },
    {
      question: 'Les parfums AVANA sont-ils testés sur les animaux ?',
      answer:
        'Non, aucun de nos produits n\'est testé sur les animaux. Nous sommes engagés dans une démarche éthique et respectueuse.'
    },
  ];

  return (
    <main className="min-h-screen pt-[120px] pb-16">
      <section className="relative py-16 bg-[#f9f5eb]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-playfair text-[#c8a45d] mb-6">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Trouvez des réponses aux questions les plus courantes sur AVANA PARFUM.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="flex justify-between items-center w-full p-5 text-left bg-white hover:bg-gray-50"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <FaChevronDown
                      className={`transition-transform duration-200 text-[#c8a45d] ${
                        activeIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      activeIndex === index ? 'max-h-96 p-5' : 'max-h-0 p-0'
                    }`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#f9f5eb] p-6 rounded-lg">
              <h2 className="text-xl font-playfair text-[#c8a45d] mb-4">
                Vous avez d'autres questions ?
              </h2>
              <p className="text-gray-700 mb-4">
                N'hésitez pas à nous contacter directement par WhatsApp ou email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/212674428593"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaChevronDown className="mr-2" />
                  Contactez-nous sur WhatsApp
                </a>
                <a
                  href="mailto:contact@avanaparfum.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors"
                >
                  Envoyez-nous un email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
} 