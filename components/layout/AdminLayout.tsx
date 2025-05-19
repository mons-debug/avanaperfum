'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, FaBoxOpen, FaShoppingBag, FaUsers, 
  FaCog, FaSignOutAlt, FaTruck, FaMoneyBillWave
} from 'react-icons/fa';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  const navigationItems = [
    { label: 'Dashboard', href: '/admin', icon: <FaHome /> },
    { label: 'Products', href: '/admin/products', icon: <FaBoxOpen /> },
    { label: 'Orders', href: '/admin/orders', icon: <FaShoppingBag /> },
    { label: 'Customers', href: '/admin/customers', icon: <FaUsers /> },
    { 
      label: 'Settings', 
      href: '/admin/settings', 
      icon: <FaCog />,
      submenu: [
        { label: 'Shipping', href: '/admin/settings/shipping', icon: <FaTruck /> },
        { label: 'Payment', href: '/admin/settings/payment', icon: <FaMoneyBillWave /> },
        { label: 'About', href: '/admin/settings/about', icon: <FaUsers /> },
      ]
    }
  ];
  
  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);
  
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <Link href="/admin" className="text-xl font-semibold text-gray-800 tracking-wide">
            AVANA ADMIN
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive(item.href)
                      ? 'bg-[#c8a45d]/10 text-[#c8a45d] font-medium border-r-2 border-[#c8a45d]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-5 h-5 mr-3">{item.icon}</span>
                  {item.label}
                </Link>
                
                {item.submenu && (
                  <ul className="pl-12 space-y-1 mt-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className={`flex items-center px-4 py-2 text-xs ${
                            pathname === subItem.href
                              ? 'text-[#c8a45d] font-medium'
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          <span className="w-4 h-4 mr-2">{subItem.icon}</span>
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 