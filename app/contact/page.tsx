import { Metadata } from 'next';
import ContactContent from './ContactContent';

// SEO Metadata for Contact Page
export const metadata: Metadata = {
  title: 'Contactez-nous | AVANA PARFUM',
  description: 'Contactez AVANA PARFUM pour toutes vos questions sur nos parfums premium. Service client réactif et conseils personnalisés pour vos achats.',
  keywords: 'contact AVANA PARFUM, service client parfums, questions parfumerie, support client, conseils parfums',
  openGraph: {
    title: 'Contactez-nous | AVANA PARFUM',
    description: 'Contactez AVANA PARFUM pour toutes vos questions sur nos parfums premium. Service client réactif et conseils personnalisés.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AVANA PARFUM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contactez-nous | AVANA PARFUM',
    description: 'Contactez AVANA PARFUM pour toutes vos questions sur nos parfums premium. Service client réactif et conseils personnalisés.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
