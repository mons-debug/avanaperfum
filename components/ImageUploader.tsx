'use client';

import { useState, ChangeEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTrash, FaSpinner, FaExclamationTriangle, FaInfo, FaServer } from 'react-icons/fa';
import axios from 'axios';

interface ImageUploaderProps {
  initialImage?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export default function ImageUploader({ 
  initialImage, 
  onUpload, 
  onRemove,
  className = '' 
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImage || '');
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [showFallback, setShowFallback] = useState<boolean>(false);
  const [showDeploymentInfo, setShowDeploymentInfo] = useState<boolean>(false);
  const [deploymentSuggestions, setDeploymentSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const placeholderImage = '/images/product-placeholder.svg';

  // Check if the initial image exists, use placeholder if needed
  useEffect(() => {
    if (initialImage) {
      const testImg = document.createElement('img');
      testImg.onload = () => {
        setPreviewUrl(initialImage);
        setShowFallback(false);
      };
      testImg.onerror = () => {
        console.log('Initial image not found, using placeholder');
        setPreviewUrl(placeholderImage);
        setShowFallback(true);
      };
      testImg.src = initialImage;
    }
  }, [initialImage]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, or WEBP)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setError('');
    setIsUploading(true);
    setUploadProgress(0);
    setShowFallback(false);
    setShowDeploymentInfo(false);
    setDeploymentSuggestions([]);
    
    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress > 85 ? 85 : newProgress;
        });
      }, 100);
      
      // Create form data for API request
      const formData = new FormData();
      formData.append('file', file);
      
      // Make API request to upload the file
      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Get the URL from the response
      const fileUrl = response.data.data.url;
      
      // Set the URLs for storage and preview
      setImageUrl(fileUrl);
      setPreviewUrl(fileUrl);
      
      // Notify parent component
      onUpload(fileUrl);
      
      // Reset upload state and show success
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err: any) {
      console.error('Upload error:', err);
      
      let errorMessage = 'Failed to upload image. Please try again.';
      
      // Handle specific error types
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        
        // Check if it's a deployment/file system error
        if (err.response.data.deploymentError) {
          setShowDeploymentInfo(true);
          if (err.response.data.suggestions) {
            setDeploymentSuggestions(err.response.data.suggestions);
          }
          
          if (errorMessage.includes('read-only')) {
            errorMessage = 'File uploads not supported on this deployment platform. See deployment options below.';
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setPreviewUrl('');
    setShowFallback(false);
    if (onRemove) {
      onRemove();
    }
  };

  const handleImageError = () => {
    console.error('Image load error, using placeholder');
    setPreviewUrl(placeholderImage);
    setShowFallback(true);
  };

  return (
    <div className={`image-uploader ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-3 text-sm">
          <div className="flex items-start">
            <FaExclamationTriangle className="mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {showDeploymentInfo && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-4 text-sm">
          <div className="flex items-start">
            <FaServer className="mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-2">Deployment Platform Limitation</h4>
              <p className="mb-2">Your current deployment platform doesn't support local file uploads. Here are your options:</p>
              {deploymentSuggestions.length > 0 && (
                <ol className="list-decimal list-inside space-y-1 text-xs mb-3">
                  {deploymentSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ol>
              )}
              <div className="bg-blue-100 p-2 rounded text-xs">
                <strong>Recommended:</strong> Deploy to a VPS (DigitalOcean, Linode, AWS EC2) or use a platform with persistent storage like Railway or Render.
              </div>
            </div>
          </div>
        </div>
      )}
      
      {(imageUrl || showFallback) ? (
        <div className="relative mt-2 mb-4">
          <div className="relative h-64 w-full rounded-md overflow-hidden border border-gray-200">
            <Image
              src={previewUrl || placeholderImage}
              alt="Image preview"
              fill
              className="object-contain"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, 400px"
              onError={handleImageError}
            />
          </div>
          {showFallback && (
            <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Using placeholder image
            </div>
          )}
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ) : (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span className="flex items-center justify-center">
                  <FaCloudUploadAlt className="h-8 w-8 mr-2" />
                  <span>Upload an image</span>
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  disabled={isUploading}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to 5MB
            </p>
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-center mt-2 text-sm text-blue-600">
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Uploading to local storage... {uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 