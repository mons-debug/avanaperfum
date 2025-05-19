'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

/**
 * A helper component to test local image uploads to the server's public directory
 * This can be placed on any admin page for testing
 */
export default function LocalStorageTestHelper() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const testLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setStatus('uploading');
    setMessage('Uploading image to server...');
    setErrors([]);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPG, PNG, or WEBP)');
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
      
      // Create form data for API request
      const formData = new FormData();
      formData.append('file', file);
      
      // Make API request to upload the file
      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Get URL from response
      const uploadedUrl = response.data.data.url;
      
      console.log('Image uploaded successfully to:', uploadedUrl);
      
      // Set the image URL and update status
      setImageUrl(uploadedUrl);
      setStatus('success');
      setMessage(`Upload successful! Image saved to server at: ${uploadedUrl}`);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus('error');
      setMessage(`Upload failed: ${err.response?.data?.error || err.message}`);
      setErrors(prev => [...prev, err.response?.data?.error || err.message]);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 my-5">
      <h2 className="text-xl font-bold mb-4">Local Storage Image Upload Test</h2>
      
      <div className="mb-4">
        <p className="text-sm mb-2">This helper tests local image uploads to the server's file system:</p>
        <ul className="list-disc list-inside text-xs ml-2 text-gray-700">
          <li>Uploads real files to public/images/products/ directory</li>
          <li>Files are stored directly on the server</li>
          <li>No Cloudinary integration needed</li>
          <li>Images are immediately available after upload</li>
        </ul>
      </div>
      
      <div className="mb-5">
        <label
          htmlFor="test-upload"
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          {status === 'uploading' ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="mr-2" />
              <span>Test Local Image Upload</span>
            </>
          )}
          <input
            id="test-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={testLocalImageUpload}
            disabled={status === 'uploading'}
          />
        </label>
      </div>
      
      {status !== 'idle' && (
        <div className={`p-3 rounded-md mb-4 ${
          status === 'error' ? 'bg-red-50 text-red-700' : 
          status === 'success' ? 'bg-green-50 text-green-700' : 
          'bg-blue-50 text-blue-700'
        }`}>
          <p className="font-medium">{message}</p>
          
          {errors.length > 0 && (
            <ul className="mt-2 text-sm list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {imageUrl && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Image Preview:</h3>
          <div className="relative h-64 w-full rounded-md overflow-hidden border border-gray-200">
            <Image
              src={imageUrl}
              alt="Test image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
              onError={() => {
                console.error('Test image failed to load:', imageUrl);
                setErrors(prev => [...prev, 'Image failed to load from URL']);
              }}
            />
          </div>
          <p className="mt-2 text-xs break-all">Image URL: {imageUrl}</p>
          <p className="text-xs text-gray-500">The image is now stored on the server in the public directory</p>
        </div>
      )}
      
      <div className="mt-5 text-xs text-gray-500">
        <p>Local Storage Information:</p>
        <p>Images are stored in: /public/images/products/</p>
        <p>URL pattern: /images/products/filename.jpg</p>
      </div>
    </div>
  );
} 