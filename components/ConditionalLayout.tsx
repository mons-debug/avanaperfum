'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TranslationProvider } from '@/components/i18n/TranslationProvider';
import FontAwesomeConfig from '@/components/FontAwesomeConfig';
import FloatingWhatsAppCart from '@/components/FloatingWhatsAppCart';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export function ConditionalLayout({ children, locale }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route is admin-related
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/admin-login');
  
  // For admin routes, render minimal layout
  if (isAdminRoute) {
    return (
      <div className="admin-wrapper">
        <FontAwesomeConfig />
        {children}
      </div>
    );
  }
  
  // For regular routes, render full layout with header and footer
  return (
    <div className="root-wrapper overflow-x-hidden no-x-scrollbar">
      <FontAwesomeConfig />
      <TranslationProvider locale={locale}>
        <Header />
        <main className="flex-grow pt-header overflow-x-hidden w-full">
          {children}
        </main>
        <Footer />
        <FloatingWhatsAppCart />
      </TranslationProvider>
    </div>
  );
} 