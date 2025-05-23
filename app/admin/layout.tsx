import React from "react";
import { AdminLayoutClient, AdminProvider } from './AdminComponents';

// Server component - can export metadata
export const metadata = {
  title: 'AVANA PARFUM - Admin Panel',
  description: 'Admin panel for AVANA PARFUM website',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminProvider>
  );
}
