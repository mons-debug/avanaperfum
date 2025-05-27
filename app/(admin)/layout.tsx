import React from "react";
import { AdminLayoutClient, AdminProvider } from './admin/AdminComponents';
import './admin/admin.css';

// Server component - can export metadata
export const metadata = {
  title: 'AVANA PARFUM - Admin Panel',
  description: 'Admin panel for AVANA PARFUM website',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AVANA PARFUM - Admin Panel</title>
      </head>
      <body className="admin-body">
        <AdminProvider>
          <AdminLayoutClient>{children}</AdminLayoutClient>
        </AdminProvider>
      </body>
    </html>
  );
} 