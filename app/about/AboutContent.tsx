'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaAward, FaLeaf, FaHandshake, FaHeart } from 'react-icons/fa';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function AboutContent() {
  const [activeTab, setActiveTab] = useState('story');

  const tabContent = {
    story: (
      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-gray-700">
          Fondée en 2018, AVANA PARFUM a commencé avec une mission simple : rendre les expériences de parfums de luxe accessibles à tous. Notre fondateur, avec plus de 15 ans d&apos;expérience dans l&apos;industrie du parfum, a reconnu que de nombreuses personnes apprécient les fragrances raffinées mais trouvent les prix des créateurs prohibitifs.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          En commençant avec seulement 10 parfums signature, nous avons développé notre collection à plus de 100 fragrances premium inspirées des parfums de renommée mondiale. Chaque parfum AVANA capture l&apos;essence des parfums de luxe tout en maintenant un prix abordable et une qualité exceptionnelle.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          Aujourd&apos;hui, AVANA PARFUM sert fièrement des milliers de clients à travers le Maroc et s&apos;étend à l&apos;international, apportant notre passion pour les fragrances de luxe accessibles à de nouveaux marchés.
        </p>
      </div>
    ),
    mission: (
      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-gray-700">
          Chez AVANA PARFUM, notre mission est de démocratiser les parfums de luxe en créant des parfums de qualité premium accessibles à tous. Nous croyons que chacun mérite de vivre la confiance et le plaisir qui viennent avec le port d&apos;un parfum distinctif.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          Nous nous engageons à :
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
          <li>Créer des fragrances de haute qualité qui rivalisent avec les marques premium</li>
          <li>Maintenir des prix abordables sans compromettre la qualité</li>
          <li>Fournir un service client exceptionnel et des recommandations personnalisées</li>
          <li>Innover constamment et élargir notre collection</li>
        </ul>
      </div>
    ),
    values: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: <FaLeaf className="w-8 h-8 text-[#c8a45d]" />,
              title: "Qualité",
              description: "Nous utilisons uniquement les meilleurs ingrédients pour garantir que nos parfums durent longtemps et restent fidèles à leur inspiration."
            },
            {
              icon: <FaAward className="w-8 h-8 text-[#c8a45d]" />,
              title: "Excellence",
              description: "Nous visons l&apos;excellence dans tout ce que nous faisons, du développement de produits au service client."
            },
            {
              icon: <FaHandshake className="w-8 h-8 text-[#c8a45d]" />,
              title: "Intégrité",
              description: "Nous opérons avec transparence et honnêteté dans toutes nos pratiques commerciales."
            },
            {
              icon: <FaHeart className="w-8 h-8 text-[#c8a45d]" />,
              title: "Passion",
              description: "Notre amour pour les parfums nous pousse à créer des senteurs qui évoquent des émotions et laissent des impressions durables."
            }
          ].map((value, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#f9f5eb] mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-playfair text-gray-800 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#f9f5eb] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-playfair text-[#c8a45d] mb-6">
              À Propos d&apos;AVANA PARFUM
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Création de parfums de luxe accessibles inspirés des plus beaux parfums du monde.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white clip-path-wave"></div>
      </section>

      {/* About Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-[4/3] w-full">
                  <Image
                    src="/images/about-avana.jpg"
                    alt="AVANA PARFUM luxury perfume collection"
                    fill
                    className="object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="order-1 lg:order-2">
              <div className="mb-8">
                <div className="flex border-b border-gray-200">
                  {[{id: 'story', label: 'Histoire'}, {id: 'mission', label: 'Mission'}, {id: 'values', label: 'Valeurs'}].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium uppercase tracking-wider ${
                        activeTab === tab.id
                          ? 'border-b-2 border-[#c8a45d] text-[#c8a45d]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Notre {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tab-content py-4">
                {tabContent[activeTab as keyof typeof tabContent]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "100+", label: "Parfums" },
              { number: "5+", label: "Années d&apos;Expérience" },
              { number: "10k+", label: "Clients Satisfaits" },
              { number: "30+", label: "Villes Desservies" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-3xl md:text-4xl font-playfair text-[#c8a45d] mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section removed as requested */}

      {/* CTA Section */}
      <section className="py-16 bg-[#f9f5eb]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-[#c8a45d] mb-4">
              Découvrez AVANA PARFUM Aujourd'hui
            </h2>
            <p className="text-gray-700 mb-8">
              Explorez notre collection exquise de parfums premium à des prix abordables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop"
                className="px-8 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors"
              >
                Acheter Maintenant
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-3 border-2 border-[#c8a45d] text-[#c8a45d] rounded-full hover:bg-[#c8a45d]/10 transition-colors"
              >
                Contactez-Nous
              </Link>
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