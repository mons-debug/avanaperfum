'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaShoppingBag, FaWhatsapp } from 'react-icons/fa';

// No need to declare the window interface here as it's now handled in lib/cart.ts

export default function ThankYouPage() {
  // Clear the cart when the thank you page is loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && window.clearCart) {
      window.clearCart();
    }
  }, []);
  
  return (
    <div className="min-h-[80vh] pt-[120px] pb-16 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto text-center p-8 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-3">Merci pour votre commande !</h1>
        
        <p className="text-lg text-gray-600 mb-4">
          Votre commande a été reçue et est en cours de traitement.
        </p>
        
        <p className="text-gray-600 mb-8">
          Nous vous contacterons bientôt pour confirmer les détails et organiser la livraison. 
          Merci de votre confiance en AVANA PARFUM !
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/"
            className="flex items-center justify-center px-6 py-3 bg-[#c8a45d] text-white rounded-lg hover:bg-[#b08d48] transition-colors"
          >
            <FaHome className="mr-2" />
            Retour à l'accueil
          </Link>
          
          <Link 
            href="/shop"
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaShoppingBag className="mr-2" />
            Continuer mes achats
          </Link>
          
          <a 
            href="https://wa.me/+212674428593" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaWhatsapp className="mr-2" />
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
} 