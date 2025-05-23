'use client';

import React from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';

const TermsPage = () => {
  return (
    <main className="min-h-screen pt-[120px] pb-16">
      <section className="relative py-16 bg-[#f9f5eb]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-playfair text-[#c8a45d] mb-6">
              Conditions Générales de Vente
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Veuillez lire attentivement ces conditions avant d'utiliser les services d'AVANA PARFUM
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>1. Introduction</h2>
            <p>
              Bienvenue sur AVANA PARFUM. Ces conditions générales de vente régissent votre utilisation de notre site web et vos achats de nos produits. En accédant à notre site ou en passant une commande, vous acceptez d'être lié par ces conditions.
            </p>

            <h2>2. Commandes et Paiements</h2>
            <p>
              Lorsque vous passez une commande sur notre site, vous nous faites une offre d'achat. Nous nous réservons le droit d'accepter ou de refuser votre commande pour quelque raison que ce soit. Une fois votre commande acceptée, vous recevrez une confirmation par email.
            </p>
            <p>
              Nous acceptons divers modes de paiement, y compris les cartes de crédit, les virements bancaires et les paiements à la livraison. Tous les prix sont indiqués en dirhams marocains (MAD) et incluent la TVA applicable.
            </p>

            <h2>3. Livraison</h2>
            <p>
              Nous nous efforçons de livrer votre commande dans les délais indiqués lors de votre achat. Les délais de livraison standard sont de 3 à 5 jours ouvrables au Maroc. Pour les commandes internationales, les délais peuvent varier de 7 à 14 jours ouvrables.
            </p>
            <p>
              Les frais de livraison sont calculés en fonction de votre adresse et du poids de votre commande. Ces frais vous seront indiqués avant la finalisation de votre achat.
            </p>

            <h2>4. Retours et Remboursements</h2>
            <p>
              Vous pouvez retourner un produit dans les 14 jours suivant sa réception si celui-ci n'a pas été ouvert ou utilisé. Pour effectuer un retour, veuillez nous contacter à contact@avanaparfum.com ou au +212 674428593.
            </p>
            <p>
              Les remboursements seront effectués en utilisant le même mode de paiement que celui utilisé pour l'achat initial. Le montant remboursé inclura le prix du produit mais pas les frais de livraison, sauf si le retour est dû à un défaut du produit.
            </p>

            <h2>5. Propriété Intellectuelle</h2>
            <p>
              Tout le contenu présent sur notre site web, y compris les textes, graphiques, logos, images et logiciels, est la propriété d'AVANA PARFUM et est protégé par les lois sur la propriété intellectuelle.
            </p>

            <h2>6. Responsabilité</h2>
            <p>
              AVANA PARFUM ne sera pas responsable des dommages indirects, spéciaux ou consécutifs résultant de l'utilisation de nos produits ou services.
            </p>

            <h2>7. Modifications des Conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur notre site. Il est de votre responsabilité de consulter régulièrement ces conditions pour vous tenir informé des mises à jour.
            </p>

            <h2>8. Contact</h2>
            <p>
              Si vous avez des questions concernant ces conditions, veuillez nous contacter :
            </p>
            <ul>
              <li>Par email : contact@avanaparfum.com</li>
              <li>Par téléphone : +212 674428593</li>
              <li>Par WhatsApp : +212 674428593</li>
            </ul>

            <p className="text-sm text-gray-500 mt-8">
              Dernière mise à jour : Mai 2025
            </p>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
};

export default TermsPage;
