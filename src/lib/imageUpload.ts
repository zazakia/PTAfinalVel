// Image upload utilities for handling receipt images

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload image to Cloudinary
 * This is the recommended approach for production
 */
export const uploadToCloudinary = async (file: File): Promise<UploadResult> => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return {
        success: false,
        error: 'Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.secure_url
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

/**
 * Convert file to base64 for storage in database
 * Use this for development or small files (not recommended for production)
 */
export const convertToBase64 = (file: File): Promise<UploadResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve({
        success: true,
        url: reader.result as string
      });
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to convert file to base64'
      });
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please upload an image smaller than 5MB.'
    };
  }

  return { valid: true };
};

/**
 * Main upload function that chooses the best method
 */
export const uploadImage = async (file: File): Promise<UploadResult> => {
  // Validate file first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }

  // Try Cloudinary first, fallback to base64
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset && cloudName !== 'your_cloud_name') {
    return await uploadToCloudinary(file);
  } else {
    // Fallback to base64 for development
    console.warn('Using base64 storage for images. Configure Cloudinary for production use.');
    return await convertToBase64(file);
  }
};