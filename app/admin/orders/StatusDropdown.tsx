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
    { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'Called', label: 'Called', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Confirmed', label: 'Confirmed', color: 'bg-purple-100 text-purple-800' },
    { value: 'Shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'Delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
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
    return status ? status.color : 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-32 px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getCurrentStatusColor()}`}>
          {currentStatus}
        </span>
        <FaChevronDown className="text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
          {statuses.map((status) => (
            <button
              key={status.value}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                status.value === currentStatus ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleStatusSelect(status.value)}
            >
              <span className={`inline-block mr-2 px-2 py-1 rounded-full text-xs font-bold ${status.color}`}>
                {status.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown; 