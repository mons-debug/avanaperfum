import { Metadata } from 'next';
import FAQContent from './FAQContent';

// SEO Metadata for FAQ Page
export const metadata: Metadata = {
  title: 'FAQ – Questions Fréquentes | AVANA PARFUM',
  description: 'Trouvez des réponses aux questions les plus courantes sur AVANA PARFUM : commandes, livraison, qualité des parfums, retours et plus encore.',
  keywords: 'FAQ AVANA PARFUM, questions fréquentes parfums, aide commandes parfumerie, support client parfums, retours parfums',
  openGraph: {
    title: 'FAQ – Questions Fréquentes | AVANA PARFUM',
    description: 'Trouvez des réponses aux questions les plus courantes sur AVANA PARFUM : commandes, livraison, qualité des parfums, retours et plus encore.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AVANA PARFUM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ – Questions Fréquentes | AVANA PARFUM',
    description: 'Trouvez des réponses aux questions les plus courantes sur AVANA PARFUM : commandes, livraison, qualité des parfums.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FAQPage() {
  return <FAQContent />;
}
