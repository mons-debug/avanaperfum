'use client';

import { useState } from 'react';
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function LocalImageInstructions() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full text-left"
      >
        <div className="flex items-center">
          <FaInfoCircle className="text-green-600 mr-2" />
          <h3 className="font-semibold text-green-800">
            Image Upload System Information
          </h3>
        </div>
        {isExpanded ? (
          <FaChevronUp className="text-green-600" />
        ) : (
          <FaChevronDown className="text-green-600" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-3">
          <p className="text-sm text-gray-700 mb-2">
            This application uses a fully automated local image storage system:
          </p>
          
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-2">
            <li>
              <strong>Automatic uploads</strong>: Images are automatically saved to the server when selected
            </li>
            <li>
              <strong>Storage location</strong>: Files are stored in <code className="bg-green-100 px-1 rounded">public/images/products/</code> directory
            </li>
            <li>
              <strong>Image URL format</strong>: All images use the pattern <code className="bg-green-100 px-1 rounded">/images/products/filename.jpg</code>
            </li>
            <li>
              <strong>Supported formats</strong>: JPG, PNG, and WEBP files (up to 5MB)
            </li>
          </ul>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3 text-xs text-blue-800">
            <p className="font-semibold">System Details:</p>
            <p>The image upload system uses:</p>
            <ul className="list-disc list-inside ml-2 mt-1">
              <li>Next.js API routes for server-side handling</li>
              <li>Local file system storage in the public directory</li>
              <li>Unique filename generation to prevent conflicts</li>
              <li>Instant image previews after upload</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 