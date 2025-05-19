import './globals.css';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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

export const metadata = {
  title: 'AVANA PARFUM | Luxury Inspired Fragrances',
  description: 'Discover our collection of premium inspired fragrances for him and her.',
  keywords: 'perfume, fragrance, luxury perfume, inspired perfume, designer fragrance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} overflow-x-hidden w-full`}>
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full">
        <Header />
        <main className="flex-grow pt-header overflow-x-hidden w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
