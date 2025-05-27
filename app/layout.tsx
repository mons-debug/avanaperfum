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
  
  // Favicon and icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#c8a45d' },
    ],
  },
  
  // Web App Manifest
  manifest: '/site.webmanifest',
  
  // Theme colors
  themeColor: '#c8a45d',
  
  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AVANA PARFUM',
  },
  
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  
  openGraph: {
    title: 'Parfums de Luxe Inspirés – AVANA PARFUM Maroc',
    description: 'Découvrez des parfums de qualité premium inspirés des grandes marques à des prix accessibles. Livraison rapide au Maroc.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AVANA PARFUM',
    images: [
      {
        url: '/images/logowhw.png',
        width: 1200,
        height: 630,
        alt: 'AVANA PARFUM - Parfums de Luxe',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Parfums de Luxe Inspirés – AVANA PARFUM Maroc',
    description: 'Découvrez des parfums de qualité premium inspirés des grandes marques à des prix accessibles. Livraison rapide au Maroc.',
    images: ['/images/logowhw.png'],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: 'https://avanaparfum.com',
  },
  
  // Additional meta tags
  other: {
    'msapplication-TileColor': '#c8a45d',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always default to French
  const locale = 'fr';
  
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
