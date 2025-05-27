'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface StatusDropdownProps {
  orderId: string;
  currentStatus: string;
  onStatusChange: (orderId: string, status: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  orderId, 
  currentStatus, 
  onStatusChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const statuses = [
    { value: 'New', label: 'Nouveau', color: 'bg-blue-100 text-blue-800', activeColor: 'bg-blue-500 text-white' },
    { value: 'Called', label: 'Appelé', color: 'bg-yellow-100 text-yellow-800', activeColor: 'bg-yellow-500 text-white' },
    { value: 'Confirmed', label: 'Confirmé', color: 'bg-purple-100 text-purple-800', activeColor: 'bg-purple-500 text-white' },
    { value: 'Shipped', label: 'Expédié', color: 'bg-indigo-100 text-indigo-800', activeColor: 'bg-indigo-500 text-white' },
    { value: 'Delivered', label: 'Livré', color: 'bg-green-100 text-green-800', activeColor: 'bg-green-500 text-white' },
    { value: 'Cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800', activeColor: 'bg-red-500 text-white' },
  ];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle status change
  const handleStatusSelect = (status: string) => {
    onStatusChange(orderId, status);
    setIsOpen(false);
  };
  
  // Get current status color
  const getCurrentStatusColor = () => {
    const status = statuses.find(s => s.value === currentStatus);
    return status ? status.activeColor : 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="w-full" ref={dropdownRef}>
      {/* Status dropdown button */}
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c8a45d] focus:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-medium ${getCurrentStatusColor()}`}>
            {statuses.find(s => s.value === currentStatus)?.label || currentStatus}
          </span>
          <span className="ml-2 text-gray-600">Changer le statut</span>
        </div>
        <FaChevronDown className={`text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {/* Status options dropdown - Mobile Centered & Properly Positioned */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-[1000] flex items-center justify-center p-4 status-dropdown-overlay" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white border border-gray-200 rounded-lg shadow-xl py-2 overflow-y-auto max-h-[80vh] w-full max-w-sm z-[1001] status-dropdown-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-100 mb-1">
              <h3 className="font-medium text-gray-700 text-center">Statut de commande</h3>
            </div>
            
            {statuses.map((status) => (
              <button
                key={status.value}
                className={`flex items-center w-full text-left px-4 py-4 text-sm hover:bg-gray-50 transition-colors ${status.value === currentStatus ? 'bg-gray-50' : ''}`}
                onClick={() => handleStatusSelect(status.value)}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-full mr-3 flex items-center justify-center ${status.value === currentStatus ? status.activeColor : status.color}`}>
                  {status.value === currentStatus && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </span>
                <span className="font-medium text-base">{status.label}</span>
                {status.value === currentStatus && (
                  <span className="ml-auto bg-[#c8a45d] text-white text-xs px-3 py-1 rounded-full">
                    Actuel
                  </span>
                )}
              </button>
            ))}
            
            {/* Close button */}
            <div className="px-4 py-3 border-t border-gray-100 mt-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown; 