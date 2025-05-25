import { Metadata } from 'next';
import AboutContent from './AboutContent';

// SEO Metadata for About Page
export const metadata: Metadata = {
  title: 'À propos – Notre Histoire | AVANA PARFUM',
  description: 'Découvrez l\'histoire d\'AVANA PARFUM, notre mission et nos valeurs. Créateurs de parfums de luxe accessibles inspirés des plus grandes marques depuis 2018.',
  keywords: 'à propos AVANA PARFUM, histoire parfums, mission parfumerie, valeurs entreprise, parfums luxe accessible',
  openGraph: {
    title: 'À propos – Notre Histoire | AVANA PARFUM',
    description: 'Découvrez l\'histoire d\'AVANA PARFUM, notre mission et nos valeurs. Créateurs de parfums de luxe accessibles inspirés des plus grandes marques depuis 2018.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AVANA PARFUM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos – Notre Histoire | AVANA PARFUM',
    description: 'Découvrez l\'histoire d\'AVANA PARFUM, notre mission et nos valeurs. Créateurs de parfums de luxe accessibles.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
