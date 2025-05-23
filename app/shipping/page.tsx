'use client';

import React from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FaTruck, FaClock, FaMapMarkerAlt, FaMoneyBillWave, FaWhatsapp } from 'react-icons/fa';

const ShippingPage = () => {
  return (
    <main className="min-h-screen pt-[120px] pb-16">
      <section className="relative py-16 bg-[#f9f5eb]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-playfair text-[#c8a45d] mb-6">
              Informations de Livraison
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Tout ce que vous devez savoir sur la livraison de vos parfums AVANA
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#f9f5eb] flex items-center justify-center mr-4">
                    <FaTruck className="text-[#c8a45d] text-xl" />
                  </div>
                  <h2 className="text-xl font-playfair text-gray-800">Zones de Livraison</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Nous livrons dans tout le Maroc ainsi que vers plusieurs destinations internationales.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <FaMapMarkerAlt className="text-[#c8a45d] mt-1 mr-2" />
                    <span>Livraison nationale: Toutes les villes du Maroc</span>
                  </li>
                  <li className="flex items-start">
                    <FaMapMarkerAlt className="text-[#c8a45d] mt-1 mr-2" />
                    <span>Livraison internationale: Consultez-nous pour les pays disponibles</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#f9f5eb] flex items-center justify-center mr-4">
                    <FaClock className="text-[#c8a45d] text-xl" />
                  </div>
                  <h2 className="text-xl font-playfair text-gray-800">Délais de Livraison</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Nos délais de livraison varient selon votre localisation:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <FaClock className="text-[#c8a45d] mt-1 mr-2" />
                    <span>Casablanca: 24-48 heures</span>
                  </li>
                  <li className="flex items-start">
                    <FaClock className="text-[#c8a45d] mt-1 mr-2" />
                    <span>Autres villes du Maroc: 3-5 jours ouvrables</span>
                  </li>
                  <li className="flex items-start">
                    <FaClock className="text-[#c8a45d] mt-1 mr-2" />
                    <span>International: 7-14 jours ouvrables</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-16">
              <h2 className="text-2xl font-playfair text-[#c8a45d] mb-6">Frais de Livraison</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-gray-800">Zone</th>
                      <th className="px-4 py-3 text-left text-gray-800">Commande Standard</th>
                      <th className="px-4 py-3 text-left text-gray-800">Commande +500 DH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Casablanca</td>
                      <td className="px-4 py-3 text-gray-700">30 DH</td>
                      <td className="px-4 py-3 text-gray-700">Gratuit</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Rabat, Marrakech, Tanger</td>
                      <td className="px-4 py-3 text-gray-700">40 DH</td>
                      <td className="px-4 py-3 text-gray-700">Gratuit</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Autres villes du Maroc</td>
                      <td className="px-4 py-3 text-gray-700">50 DH</td>
                      <td className="px-4 py-3 text-gray-700">20 DH</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700">International</td>
                      <td className="px-4 py-3 text-gray-700">Sur devis</td>
                      <td className="px-4 py-3 text-gray-700">Sur devis</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-16">
              <h2 className="text-2xl font-playfair text-[#c8a45d] mb-6">Modes de Paiement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-[#c8a45d] mr-3" />
                    <h3 className="font-medium text-gray-800">Paiement à la livraison</h3>
                  </div>
                  <p className="text-gray-600 pl-8">
                    Payez en espèces directement au livreur lors de la réception de votre colis.
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-[#c8a45d] mr-3" />
                    <h3 className="font-medium text-gray-800">Virement bancaire</h3>
                  </div>
                  <p className="text-gray-600 pl-8">
                    Effectuez un virement sur notre compte bancaire avant l'expédition de votre commande.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f9f5eb] p-6 rounded-lg">
              <h2 className="text-xl font-playfair text-[#c8a45d] mb-4">
                Questions sur votre livraison ?
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant votre livraison, n'hésitez pas à nous contacter directement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/212674428593"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="mr-2" />
                  Contactez-nous sur WhatsApp
                </a>
                <a
                  href="tel:+212674428593"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors"
                >
                  Appelez-nous
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
};

export default ShippingPage;
