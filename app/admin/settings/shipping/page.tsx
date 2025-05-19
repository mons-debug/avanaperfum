'use client';

import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaInfoCircle } from 'react-icons/fa';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ShippingSettings() {
  const [settings, setSettings] = useState({
    shippingFee: 30,
    freeShippingThreshold: 250,
    currency: 'DH'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data.success && data.data) {
          setSettings({
            shippingFee: data.data.shippingFee,
            freeShippingThreshold: data.data.freeShippingThreshold,
            currency: data.data.currency || 'DH'
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load settings. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'currency' ? value : Number(value)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Shipping settings updated successfully!'
        });
      } else {
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (message.type === 'success') {
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    }
  };
  
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Shipping Settings</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c8a45d]"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div className={`p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
            
            <div>
              <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Fee
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  name="shippingFee"
                  id="shippingFee"
                  min="0"
                  step="0.01"
                  value={settings.shippingFee}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-12 focus:border-[#c8a45d] focus:ring-[#c8a45d] sm:text-sm"
                  placeholder="30"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{settings.currency}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This is the default shipping fee that will be applied to all orders below the free shipping threshold.
              </p>
            </div>
            
            <div>
              <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Threshold
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  name="freeShippingThreshold"
                  id="freeShippingThreshold"
                  min="0"
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-12 focus:border-[#c8a45d] focus:ring-[#c8a45d] sm:text-sm"
                  placeholder="250"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{settings.currency}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Orders with a total value above this amount will qualify for free shipping.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">How shipping works</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Orders below {settings.freeShippingThreshold} {settings.currency} will have a shipping fee of {settings.shippingFee} {settings.currency}. 
                  Orders equal to or above {settings.freeShippingThreshold} {settings.currency} will have free shipping.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSaving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c8a45d] hover:bg-[#b08d48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a45d] disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="mr-2">Saving...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
} 