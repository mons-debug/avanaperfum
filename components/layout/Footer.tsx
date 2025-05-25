'use client';

import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '@/components/i18n/TranslationProvider';
import { useState, useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Only run client-side effects after component is mounted
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Pre-fetch all translations to prevent rendering issues
  const translatedLinks = {
    forHim: t('footer.links.forHim'),
    forHer: t('footer.links.forHer'),
    collections: t('footer.links.collections'),
    newArrivals: t('footer.links.newArrivals'),
    bestSellers: t('footer.links.bestSellers'),
    aboutUs: t('footer.links.aboutUs'),
    contact: t('header.contact'),
    careers: t('footer.links.careers'),
    storeLocator: t('footer.links.storeLocator'),
    faq: t('footer.links.faq'),
    shippingInfo: t('footer.links.shippingInfo'),
    returns: t('footer.links.returns'),
    trackOrder: t('footer.links.trackOrder'),
    privacyPolicy: t('footer.links.privacyPolicy'),
    termsOfService: t('footer.links.termsOfService'),
    refundPolicy: t('footer.links.refundPolicy')
  };

  const translatedCategories = {
    shop: t('footer.categories.shop'),
    company: t('footer.categories.company'),
    support: t('footer.categories.support'),
    contact: t('footer.categories.contact')
  };

  const translatedSocial = {
    facebook: t('footer.social.facebook'),
    twitter: t('footer.social.twitter'),
    instagram: t('footer.social.instagram'),
    whatsapp: t('footer.social.whatsapp')
  };

  const translatedNewsletter = {
    title: t('footer.newsletter.title'),
    description: t('footer.newsletter.description'),
    placeholder: t('footer.newsletter.placeholder'),
    button: t('footer.newsletter.button')
  };

  const translatedAbout = {
    description: t('footer.about.description')
  };

  const copyright = t('footer.copyright', { year: currentYear });

  const footerLinks = {
    shop: [
      { id: 'shop-homme', href: '/shop?gender=Homme', label: 'Pour Homme' },
      { id: 'shop-femme', href: '/shop?gender=Femme', label: 'Pour Femme' },
      { id: 'shop-all', href: '/shop', label: 'Tous les parfums' },
    ],
    company: [
      { id: 'company-about', href: '/about', label: 'À propos' },
      { id: 'company-contact', href: '/contact', label: 'Contact' },
    ],
    support: [
      { id: 'support-faq', href: '/faq', label: 'FAQ' },
      { id: 'support-shipping', href: '/shipping', label: 'Livraison' },
    ],
    legal: [
      { id: 'legal-privacy', href: '/privacy', label: 'Confidentialité' },
      { id: 'legal-terms', href: '/terms', label: 'Conditions' },
    ],
  };

  const socialLinks = [
    { href: 'https://wa.me/+212674428593', icon: FaWhatsapp, label: 'WhatsApp' },
    { href: 'mailto:info@avanaparfum.com', icon: FaInstagram, label: 'Email' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Newsletter Section */}
      <div className="bg-primary/5 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-display text-primary mb-2 md:mb-3">{translatedNewsletter.title}</h2>
            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
              {translatedNewsletter.description}
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={translatedNewsletter.placeholder}
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-secondary text-sm md:text-base"
              />
              <button
                type="submit"
                className="px-5 py-2.5 md:px-6 md:py-3 bg-secondary text-white rounded-full hover:bg-secondary-dark transition-colors text-sm md:text-base"
              >
                {translatedNewsletter.button}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-4">
              <img 
                src="/images/lgoavana.png" 
                alt="AVANA PARFUM" 
                className="h-14" 
              />
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              {translatedAbout.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-gray-600 hover:bg-secondary hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Columns - Mobile Collapsible, Desktop Always Expanded */}
          <div className="border-b md:border-b-0 border-gray-100 pb-4 md:pb-0">
            <button 
              className="w-full flex items-center justify-between font-medium text-gray-900 mb-4 md:mb-4 md:cursor-default"
              onClick={() => toggleSection('shop')}
            >
              <span>{translatedCategories.shop}</span>
              <span className="md:hidden">
                {expandedSection === 'shop' ? '−' : '+'}
              </span>
            </button>
            <ul className="space-y-2 md:space-y-3 hidden md:block" data-expanded={expandedSection === 'shop'} style={{ display: expandedSection === 'shop' ? 'block' : '' }}>
              {footerLinks.shop.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base text-gray-600 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-b md:border-b-0 border-gray-100 py-4 md:py-0">
            <button 
              className="w-full flex items-center justify-between font-medium text-gray-900 mb-4 md:mb-4 md:cursor-default"
              onClick={() => toggleSection('company')}
            >
              <span>{translatedCategories.company}</span>
              <span className="md:hidden">
                {expandedSection === 'company' ? '−' : '+'}
              </span>
            </button>
            <ul className="space-y-2 md:space-y-3 hidden md:block" data-expanded={expandedSection === 'company'} style={{ display: expandedSection === 'company' ? 'block' : '' }}>
              {footerLinks.company.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base text-gray-600 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="py-4 md:py-0">
            <button 
              className="w-full flex items-center justify-between font-medium text-gray-900 mb-4 md:mb-4 md:cursor-default"
              onClick={() => toggleSection('support')}
            >
              <span>{translatedCategories.support}</span>
              <span className="md:hidden">
                {expandedSection === 'support' ? '−' : '+'}
              </span>
            </button>
            <div className="hidden md:block" data-expanded={expandedSection === 'support'} style={{ display: expandedSection === 'support' ? 'block' : '' }}>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-sm md:text-base text-gray-600 hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">{translatedCategories.contact}</h3>
                <p className="text-gray-600 text-sm md:text-base">contact@avanaparfum.com</p>
                <p className="text-gray-600 text-sm md:text-base">+212 674428593</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Improved for Mobile */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-gray-600 text-xs md:text-sm order-2 md:order-1 text-center md:text-left">
              {copyright}
            </p>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:space-x-6 mb-3 md:mb-0 order-1 md:order-2 w-full md:w-auto">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-xs md:text-sm text-gray-600 hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 