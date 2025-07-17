import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileImage } from 'lucide-react';
import { uploadImage, UploadResult } from '@/lib/imageKitUpload';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  label?: string;
  accept?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  currentImage,
  label = "Upload Receipt Image",
  accept = "image/*",
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const result: UploadResult = await uploadImage(file);
      
      if (result.success && result.url) {
        onImageUpload(result.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onImageRemove();
    toast.success('Image removed');
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {currentImage ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={currentImage}
                alt="Receipt"
                className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click the X button to remove this image
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={triggerFileSelect}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                    <FileImage className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    disabled={disabled}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
};