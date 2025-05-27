'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaLock, FaEnvelope, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

function AdminLoginForm() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f9f5eb] to-white p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/"
          className="mb-8 flex items-center text-gray-600 hover:text-[#c8a45d] transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Return to Website
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/images/lgoavana.png" 
                alt="AVANA PARFUM" 
                width={120} 
                height={102} 
                className="h-24 w-auto" 
              />
            </div>
            <p className="mt-2 text-gray-500">Admin Access</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                <FaExclamationTriangle className="mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
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
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
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
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c8a45d] hover:bg-[#b89242] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8a45d] ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} AVANA PARFUM. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f9f5eb] to-white p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-[#f9f5eb] rounded-lg flex items-center justify-center">
                  <span className="text-[#c8a45d] text-xl font-bold">AP</span>
                </div>
              </div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
