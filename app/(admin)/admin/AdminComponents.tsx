'use client';

import React, { useState } from "react";
import Link from 'next/link';
import { 
  FaShoppingBag, 
  FaBox, 
  FaTags, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaHome,
  FaUserCog,
  FaBars,
  FaTimes,
  FaBell,
  FaUser
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

// Mobile-first sidebar component
export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  
  const isLinkActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaChartBar />, color: 'text-blue-600' },
    { path: '/admin/orders', label: 'Commandes', icon: <FaShoppingBag />, color: 'text-green-600' },
    { path: '/admin/products', label: 'Produits', icon: <FaBox />, color: 'text-purple-600' },
    { path: '/admin/categories', label: 'Catégories', icon: <FaTags />, color: 'text-orange-600' },
    { path: '/admin/settings', label: 'Paramètres', icon: <FaCog />, color: 'text-gray-600' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-gradient-to-r from-[#c8a45d] to-[#d4b366]">
          <Link href="/admin" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#c8a45d] font-bold text-sm">AP</span>
            </div>
            <span className="text-white font-bold text-lg">AVANA ADMIN</span>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden text-white hover:text-gray-200 p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isLinkActive(item.path)
                      ? 'bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#c8a45d]'
                    }
                  `}
                >
                  <span className={`w-5 h-5 mr-3 ${isLinkActive(item.path) ? 'text-white' : item.color}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
              Actions Rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#c8a45d] rounded-lg transition-colors"
                >
                  <FaHome className="w-4 h-4 mr-3" />
                  Voir le Site
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/profile"
                  onClick={onClose}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#c8a45d] rounded-lg transition-colors"
                >
                  <FaUserCog className="w-4 h-4 mr-3" />
                  Profil
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Sign Out */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => signOut({ callbackUrl: '/admin-login' })}
              className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4 mr-3" />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

// Professional admin header
export function AdminHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm admin-header">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left side - Menu toggle and breadcrumb */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FaBars size={20} />
          </button>
          
          {/* Breadcrumb for larger screens */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-800">
              Administration AVANA PARFUM
            </h1>
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-[#c8a45d] hover:bg-gray-100 rounded-lg transition-colors">
            <FaBell size={18} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#c8a45d] to-[#d4b366] rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Main admin layout wrapper
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
        
        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto admin-content">
          <div className="max-w-7xl mx-auto admin-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Provider wrapper
export function AdminProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
