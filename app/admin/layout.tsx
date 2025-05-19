"use client";

// app/admin/layout.tsx

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
import { usePathname } from 'next/navigation';

// Client component for active link detection
function AdminSidebar() {
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
  ];
  
  return (
    <nav className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-600">
        <h2 className="text-lg font-bold text-white">Admin Panel</h2>
      </div>
      
      <div className="py-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isLinkActive(item.path)
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors"
        >
          <FaHome />
          View Website
        </Link>
        
        <button
          className="flex items-center gap-3 text-sm text-gray-700 hover:text-red-600 transition-colors mt-4"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  );
}

// Client component wrapper for the admin layout
function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
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
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FaUserCog className="text-lg" />
              </button>
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
  );
}

// Server component wrapper
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
