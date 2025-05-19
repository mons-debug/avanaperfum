'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaAward, FaLeaf, FaStar, FaHandshake, FaHeart } from 'react-icons/fa';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const tabContent = {
    story: (
      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-gray-700">
          Founded in 2018, AVANA PARFUM began with a simple mission: to make luxury fragrance experiences accessible to everyone. Our founder, with over 15 years of experience in the perfume industry, recognized that many people appreciate fine fragrances but find designer prices prohibitive.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          Starting with just 10 signature scents, we've grown our collection to over 100 premium fragrances inspired by world-renowned perfumes. Each AVANA PARFUM fragrance captures the essence of luxury scents while maintaining affordability and exceptional quality.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          Today, AVANA PARFUM proudly serves thousands of customers across Morocco and is expanding internationally, bringing our passion for accessible luxury fragrance to new markets.
        </p>
      </div>
    ),
    mission: (
      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-gray-700">
          At AVANA PARFUM, our mission is to democratize luxury fragrances by creating premium quality perfumes that are accessible to all. We believe everyone deserves to experience the confidence and pleasure that comes with wearing a distinctive scent.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          We are committed to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
          <li>Creating high-quality fragrances that rival premium brands</li>
          <li>Maintaining affordable price points without compromising quality</li>
          <li>Providing exceptional customer service and personalized recommendations</li>
          <li>Constantly innovating and expanding our collection</li>
        </ul>
      </div>
    ),
    values: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: <FaLeaf className="w-8 h-8 text-[#c8a45d]" />,
              title: "Quality",
              description: "We use only the finest ingredients to ensure our fragrances are long-lasting and true to their inspiration."
            },
            {
              icon: <FaAward className="w-8 h-8 text-[#c8a45d]" />,
              title: "Excellence",
              description: "We strive for excellence in everything we do, from product development to customer service."
            },
            {
              icon: <FaHandshake className="w-8 h-8 text-[#c8a45d]" />,
              title: "Integrity",
              description: "We operate with transparency and honesty in all our business practices."
            },
            {
              icon: <FaHeart className="w-8 h-8 text-[#c8a45d]" />,
              title: "Passion",
              description: "Our love for fragrances drives us to create scents that evoke emotion and leave lasting impressions."
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
              About AVANA PARFUM
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Crafting accessible luxury fragrances inspired by the world's finest perfumes.
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
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="order-1 lg:order-2">
              <div className="mb-8">
                <div className="flex border-b border-gray-200">
                  {['story', 'mission', 'values'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-medium uppercase tracking-wider ${
                        activeTab === tab
                          ? 'border-b-2 border-[#c8a45d] text-[#c8a45d]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Our {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
              { number: "100+", label: "Fragrances" },
              { number: "5+", label: "Years Experience" },
              { number: "10k+", label: "Happy Customers" },
              { number: "30+", label: "Cities Served" }
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

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair text-[#c8a45d] mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              A passionate group of fragrance experts dedicated to bringing you the best perfume experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Benjelloun",
                role: "Founder & Creative Director",
                image: "/images/team/founder.jpg"
              },
              {
                name: "Ahmed Tazi",
                role: "Head Perfumer",
                image: "/images/team/perfumer.jpg"
              },
              {
                name: "Layla Alaoui",
                role: "Customer Experience Manager",
                image: "/images/team/customer.jpg"
              },
              {
                name: "Karim El Mansouri",
                role: "Operations Manager",
                image: "/images/team/operations.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-md bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 30vw, 20vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/team/placeholder.svg';
                    }}
                  />
                </div>
                <h3 className="text-xl font-playfair text-gray-800 mb-1">{member.name}</h3>
                <p className="text-[#c8a45d] mb-4">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#f9f5eb]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair text-[#c8a45d] mb-4">
              Experience AVANA PARFUM Today
            </h2>
            <p className="text-gray-700 mb-8">
              Discover our exquisite collection of premium fragrances at affordable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/shop"
                className="px-8 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors"
              >
                Shop Now
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-3 border-2 border-[#c8a45d] text-[#c8a45d] rounded-full hover:bg-[#c8a45d]/10 transition-colors"
              >
                Contact Us
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
