'use client';

import { useState, ChangeEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTrash, FaSpinner, FaPlus } from 'react-icons/fa';
import axios from 'axios';

interface MultiImageUploaderProps {
  initialImages?: string[];
  onImagesChange: (urls: string[]) => void;
  className?: string;
  maxImages?: number;
}

export default function MultiImageUploader({ 
  initialImages = [], 
  onImagesChange,
  className = '',
  maxImages = 5
}: MultiImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages || []);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [showFallback, setShowFallback] = useState<boolean[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const placeholderImage = '/images/product-placeholder.svg';

  // Check if initial images exist, use placeholder if needed
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      const newShowFallback = Array(initialImages.length).fill(false);
      setImageUrls(initialImages);
      setShowFallback(newShowFallback);

      // Check each image
      initialImages.forEach((image, index) => {
        if (image) {
          const testImg = document.createElement('img');
          testImg.onload = () => {
            setShowFallback(prev => {
              const updated = [...prev];
              updated[index] = false;
              return updated;
            });
          };
          testImg.onerror = () => {
            console.log(`Image ${index} not found, using placeholder`);
            setShowFallback(prev => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          };
          testImg.src = image;
        }
      });
    }
  }, [initialImages]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if we would exceed the maximum number of images
    if (imageUrls.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    setError('');
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress > 85 ? 85 : newProgress;
        });
      }, 100);
      
      const newImageUrls = [...imageUrls];
      const newShowFallback = [...showFallback];
      
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} is not a valid image type (JPG, PNG, or WEBP)`);
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds the maximum size of 5MB`);
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
        
        // Get the URL from the response
        const fileUrl = response.data.data.url;
        
        // Add to image URLs
        newImageUrls.push(fileUrl);
        newShowFallback.push(false);
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update state with all new images
      setImageUrls(newImageUrls);
      setShowFallback(newShowFallback);
      
      // Notify parent component
      onImagesChange(newImageUrls);
      
      // Reset upload state and show success
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    const newShowFallback = [...showFallback];
    
    newImageUrls.splice(index, 1);
    newShowFallback.splice(index, 1);
    
    setImageUrls(newImageUrls);
    setShowFallback(newShowFallback);
    onImagesChange(newImageUrls);
  };

  const handleImageError = (index: number) => {
    console.error(`Image load error at index ${index}, using placeholder`);
    setShowFallback(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <div className={`multi-image-uploader ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-3 text-sm">
          {error}
        </div>
      )}
      
      {/* Image Gallery */}
      {imageUrls.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700">
            Product Images ({imageUrls.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {imageUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group">
                <div className="relative h-40 w-full rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={showFallback[index] ? placeholderImage : url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    onError={() => handleImageError(index)}
                  />
                </div>
                {showFallback[index] && (
                  <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Placeholder
                  </div>
                )}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-80 hover:opacity-100"
                  aria-label="Remove image"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Button */}
      {imageUrls.length < maxImages && (
        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 border-dashed'} rounded-md`}>
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span className="flex items-center justify-center">
                  {isUploading ? (
                    <FaSpinner className="h-8 w-8 animate-spin mr-2" />
                  ) : (
                    <>
                      {imageUrls.length === 0 ? (
                        <FaCloudUploadAlt className="h-8 w-8 mr-2" />
                      ) : (
                        <FaPlus className="h-6 w-6 mr-2" />
                      )}
                    </>
                  )}
                  <span>
                    {isUploading ? 'Uploading...' : 
                      imageUrls.length === 0 ? 'Upload product images' : 'Add more images'}
                  </span>
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  disabled={isUploading}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to 5MB • {maxImages - imageUrls.length} remaining
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
                  <span>Uploading... {uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 