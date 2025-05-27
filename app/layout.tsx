import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, DM_Sans } from 'next/font/google';
import { ConditionalLayout } from '@/components/ConditionalLayout';

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
  title: 'Parfums de Luxe Inspirés – AVANA PARFUM Maroc',
  description: 'Découvrez des parfums de qualité premium inspirés des grandes marques à des prix accessibles. Livraison rapide au Maroc.',
  keywords: 'parfums de luxe, parfums inspirés, AVANA PARFUM, parfums Maroc, fragrances premium, parfums homme femme, livraison Maroc',
  openGraph: {
    title: 'Parfums de Luxe Inspirés – AVANA PARFUM Maroc',
    description: 'Découvrez des parfums de qualité premium inspirés des grandes marques à des prix accessibles. Livraison rapide au Maroc.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AVANA PARFUM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parfums de Luxe Inspirés – AVANA PARFUM Maroc',
    description: 'Découvrez des parfums de qualité premium inspirés des grandes marques à des prix accessibles. Livraison rapide au Maroc.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://avanaparfum.com',
  },
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
        <ConditionalLayout locale={locale}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
