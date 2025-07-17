// ImageKit upload service based on official documentation
// https://imagekit.io/docs/api-reference/upload-file/upload-file#Upload-file-V1

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload to ImageKit using direct client-side upload
 * Note: For production, you should implement server-side authentication
 */
export const uploadToImageKit = async (file: File): Promise<UploadResult> => {
  try {
    // Extract your ImageKit URL ID from the .env
    const imagekitUrlEndpoint = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // This contains your ImageKit URL
    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
    
    if (!imagekitUrlEndpoint || !imagekitUrlEndpoint.includes('ik.imagekit.io')) {
      throw new Error('ImageKit URL endpoint not configured properly');
    }

    // Extract the ImageKit ID from the URL (e.g., "brayanlee007" from "https://ik.imagekit.io/brayanlee007")
    const imagekitId = imagekitUrlEndpoint.split('/').pop();
    
    if (!imagekitId) {
      throw new Error('Could not extract ImageKit ID from URL');
    }

    // For a simple implementation without server-side auth, we can try direct upload
    // This requires your ImageKit account to allow unsigned uploads
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    
    // If you have a public key, add it
    if (publicKey) {
      formData.append('publicKey', publicKey);
    }

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Note: For production, you need proper authentication headers
        // This is a simplified version that may require account configuration
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.url
    };
  } catch (error) {
    console.warn('ImageKit upload failed, falling back to base64:', error);
    // Fallback to base64 if ImageKit fails
    return await convertToBase64(file);
  }
};

/**
 * Convert file to base64 (fallback method)
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
 * Main upload function that tries ImageKit first, then falls back to base64
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

  // Try ImageKit upload, fallback to base64
  return await uploadToImageKit(file);
};