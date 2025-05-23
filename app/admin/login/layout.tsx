import React from 'react';
import AuthProvider from './AuthProvider';

// This layout completely replaces the parent admin layout
// by exporting a separate RootLayout component
export const metadata = {
  title: 'Admin Login - AVANA PARFUM',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f9f5eb] min-h-screen flex flex-col">
        <AuthProvider>
          {/* Simple layout with no admin panels/navigation */}
          <div className="flex flex-grow items-center justify-center">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
