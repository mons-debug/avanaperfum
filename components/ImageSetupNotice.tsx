'use client';

import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCloudUploadAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

interface ImageSetupNoticeProps {
  imagePath: string;
}

interface ImageStatus {
  exists: boolean;
  size: number;
  checkedAt: Date;
}

const ImageSetupNotice: React.FC<ImageSetupNoticeProps> = ({ imagePath }) => {
  const [imageStatus, setImageStatus] = useState<ImageStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!imagePath || !imagePath.startsWith('/images/products/')) {
      return;
    }

    const checkImageStatus = async () => {
      setIsChecking(true);
      try {
        const response = await fetch(`/api/local-images/info?path=${encodeURIComponent(imagePath)}`);
        const data = await response.json();
        
        if (data.success) {
          setImageStatus({
            exists: data.data.fileExists,
            size: data.data.fileSize,
            checkedAt: new Date()
          });
        }
      } catch (err) {
        console.error('Error checking image status:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkImageStatus();
  }, [imagePath]);

  if (!imagePath || !imagePath.startsWith('/images/products/')) {
    return null;
  }

  const fileName = imagePath.split('/').pop();
  
  // If image exists and has content, show success notice
  if (imageStatus?.exists && imageStatus.size > 0) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r-md">
        <div className="flex items-center">
          <FaCheckCircle className="h-5 w-5 text-green-500" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Image Setup Complete
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Your image file <strong>{fileName}</strong> has been uploaded and is ready to use.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If image doesn't exist, show a warning
  if (imageStatus?.exists === false) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-4 rounded-r-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800 flex items-center">
              Image Not Found
              {isChecking && <span className="ml-2 text-xs text-orange-600">(Checking...)</span>}
            </h3>
            <div className="mt-2 text-sm text-orange-700">
              <p>
                The image file <strong>{fileName}</strong> was not found on the server. It may have been deleted or moved.
              </p>
              <p className="mt-2">
                Please upload a new image using the image uploader below.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default info notice while checking
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaInfoCircle className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800 flex items-center">
            Checking Image Status
            {isChecking && <span className="ml-2 text-xs text-blue-600">(Loading...)</span>}
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              Verifying that image <strong>{fileName}</strong> is available on the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSetupNotice; 