import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, DM_Sans } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TranslationProvider } from '@/components/i18n/TranslationProvider';
import FontAwesomeConfig from '@/components/FontAwesomeConfig';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AVANA PARFUM - Premium Inspired Fragrances',
  description: 'Discover luxury inspired fragrances at affordable prices. AVANA PARFUM offers a wide range of premium scents inspired by world-renowned perfumes.',
  keywords: 'perfume, fragrance, luxury perfume, inspired perfume, designer fragrance',
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  // Always default to French
  const locale = params.locale || 'fr';
  
  // We don't need any special check here as admin routes have their own layout.tsx
  // that overrides this root layout completely

  // Regular site pages get the full layout
  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable} overflow-x-hidden w-full`}>
      <head>
        {/* Preconnect to placeholder image */}
        <link rel="preload" href="/images/product-placeholder.svg" as="image" />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full no-x-scrollbar">
        <div className="root-wrapper overflow-x-hidden no-x-scrollbar">
          <FontAwesomeConfig />
          <TranslationProvider locale={locale}>
            <Header />
            <main className="flex-grow pt-header overflow-x-hidden w-full">
              {children}
            </main>
            <Footer />
          </TranslationProvider>
        </div>
      </body>
    </html>
  );
}
