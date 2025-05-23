'use client';

import React from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen pt-[120px] pb-16">
      <section className="relative py-16 bg-[#f9f5eb]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-playfair text-[#c8a45d] mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Comment nous protégeons vos données personnelles chez AVANA PARFUM
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Introduction</h2>
            <p>
              AVANA PARFUM s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web ou nos services.
            </p>

            <h2>Informations que nous collectons</h2>
            <p>
              Nous pouvons collecter les types d'informations suivants :
            </p>
            <ul>
              <li>Informations personnelles (nom, adresse e-mail, numéro de téléphone, adresse postale)</li>
              <li>Informations de paiement (données de carte de crédit, informations de facturation)</li>
              <li>Données de navigation (adresse IP, cookies, type de navigateur)</li>
              <li>Préférences d'achat et historique des commandes</li>
            </ul>

            <h2>Comment nous utilisons vos informations</h2>
            <p>
              Nous utilisons vos informations pour :
            </p>
            <ul>
              <li>Traiter vos commandes et vous fournir nos produits et services</li>
              <li>Communiquer avec vous concernant votre compte ou vos achats</li>
              <li>Vous envoyer des mises à jour marketing si vous avez choisi de les recevoir</li>
              <li>Améliorer notre site web et nos services</li>
              <li>Respecter nos obligations légales</li>
            </ul>

            <h2>Protection de vos données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès non autorisé, altération, divulgation ou destruction. Vos données de paiement sont cryptées lors de la transmission à l'aide de la technologie SSL (Secure Socket Layer).
            </p>

            <h2>Partage d'informations</h2>
            <p>
              Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations avec :
            </p>
            <ul>
              <li>Nos partenaires de service (traitement des paiements, livraison)</li>
              <li>Les autorités légales lorsque la loi l'exige</li>
            </ul>

            <h2>Vos droits</h2>
            <p>
              Vous avez le droit de :
            </p>
            <ul>
              <li>Accéder aux informations personnelles que nous détenons à votre sujet</li>
              <li>Corriger toute information inexacte</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour indiquer quand un cookie est envoyé.
            </p>

            <h2>Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page avec une date de mise à jour.
            </p>

            <h2>Nous contacter</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter :
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

export default PrivacyPolicyPage;
