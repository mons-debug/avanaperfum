'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from './i18n/TranslationProvider';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-avana-gray py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-playfair text-xl text-avana-gold">AVANA PARFUM</h3>
            <p className="text-gray-400 text-sm">
              {t('footer.about.description', 'Discover our collection of premium inspired fragrances, crafted with passion and precision.')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-lg text-white">{t('footer.categories.company', 'Quick Links')}</h4>
            <ul className="space-y-2">
              {[
                { key: 'shop', label: t('header.shop', 'Shop') },
                { key: 'about', label: t('header.about', 'About') },
                { key: 'contact', label: t('header.contact', 'Contact') },
                { key: 'faq', label: t('footer.links.faq', 'FAQs') }
              ].map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${link.key.toLowerCase()}`}
                    className="text-gray-400 hover:text-avana-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-playfair text-lg text-white">{t('header.contact', 'Contact')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{t('footer.contact.email', 'Email')}: info@avanaparfum.com</li>
              <li>{t('footer.contact.whatsapp', 'WhatsApp')}: +1234567890</li>
              <li>{t('footer.contact.hours', 'Hours')}: {t('footer.contact.workingHours', 'Mon-Sat, 9am-6pm')}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-playfair text-lg text-white">{t('footer.newsletter.title', 'Newsletter')}</h4>
            <p className="text-gray-400 text-sm">
              {t('footer.newsletter.description', 'Subscribe to receive updates, access to exclusive deals, and more.')}
            </p>
            <form onSubmit={handleSubmit} className="space-y-2" data-component-name="Footer">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder', 'Enter your email')}
                className="w-full px-4 py-2 bg-avana-black border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-avana-gold transition-colors"
                required
                data-component-name="Footer"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-avana-gold text-black rounded-full hover:bg-avana-gold-light transition-colors font-medium"
              >
                {t('footer.newsletter.button', 'Subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-6">
              {[
                { key: 'facebook', label: t('footer.social.facebook', 'Facebook') },
                { key: 'instagram', label: t('footer.social.instagram', 'Instagram') },
                { key: 'twitter', label: t('footer.social.twitter', 'Twitter') }
              ].map((social) => (
                <a
                  key={social.key}
                  href={`https://${social.key.toLowerCase()}.com/avanaparfum`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-avana-gold transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 