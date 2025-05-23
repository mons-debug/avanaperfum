'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaLock, FaEnvelope, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5eb]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Logo and header */}
        <div className="p-8 text-center bg-white">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#f9f5eb] shadow-inner">
              <span className="text-[#c8a45d] text-2xl font-bold">AP</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AVANA PARFUM</h1>
          <p className="mt-1 text-gray-500">Administration</p>
        </div>
        
        <div className="p-8 bg-white">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
              <FaExclamationTriangle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#c8a45d] focus:border-[#c8a45d] text-sm"
                  placeholder="admin@avanaparfum.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#c8a45d] focus:border-[#c8a45d] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-[#c8a45d] hover:bg-[#b89242] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a45d] transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
            <Link 
              href="/"
              className="text-sm text-gray-500 hover:text-[#c8a45d] transition-colors flex items-center"
            >
              <FaArrowLeft className="mr-2 text-xs" />
              Return to Website
            </Link>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} AVANA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
