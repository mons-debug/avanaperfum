'use client';

import React from "react";
import Link from 'next/link';
import { 
  FaShoppingBag, 
  FaBox, 
  FaTags, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaHome,
  FaUserCog
} from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

// Client component for active link detection
export function AdminSidebar() {
  const pathname = usePathname();
  
  const isLinkActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/admin/orders', label: 'Orders', icon: <FaShoppingBag /> },
    { path: '/admin/products', label: 'Products', icon: <FaBox /> },
    { path: '/admin/categories', label: 'Categories', icon: <FaTags /> },
    { path: '/admin/settings', label: 'Settings', icon: <FaCog /> },
    { path: '/admin/profile', label: 'Profile', icon: <FaUserCog /> },
    { path: '/', label: 'View Site', icon: <FaHome /> },
  ];

  return (
    <nav className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-lg font-semibold">Admin Navigation</h2>
      </div>
      <div className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isLinkActive(item.path) 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          
          <li className="pt-2 mt-2 border-t border-gray-100">
            <button
              onClick={() => signOut({ callbackUrl: '/admin-login' })}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// Client component wrapper for the admin layout
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <>
      <style jsx global>{`
        html, body {
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
          height: 100%;
          min-height: 100vh;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-100">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-blue-600">AVANA PARFUM</h1>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">Admin</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link 
                  href="/admin/profile"
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaUserCog className="text-lg" />
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        {/* Admin Navigation and Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="md:w-64 flex-shrink-0">
              <AdminSidebar />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 bg-white shadow-md rounded-lg p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
}
