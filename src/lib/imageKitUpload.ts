// ImageKit upload service for handling receipt images
// Since you have ImageKit credentials, this provides an alternative to Cloudinary

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload image to ImageKit
 * Use your existing ImageKit account
 */
export const uploadToImageKit = async (file: File): Promise<UploadResult> => {
  try {
    // For ImageKit, we need to use their upload API
    // The URL you provided looks like a delivery URL, not an upload endpoint
    // ImageKit upload typically requires server-side authentication
    
    // For now, we'll use the base64 fallback until proper ImageKit upload is configured
    console.warn('ImageKit upload not yet configured. Using base64 fallback.');
    return await convertToBase64(file);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

/**
 * Convert file to base64 for storage in database
 * This is the current working solution
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
 * Upload image to Cloudinary
 */
export const uploadToCloudinary = async (file: File): Promise<UploadResult> => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    let uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || cloudName === 'your_actual_cloud_name') {
      console.warn('Cloudinary not configured, using base64 fallback');
      return await convertToBase64(file);
    }

    // Try different preset names if the configured one fails
    const presetOptions = [
      uploadPreset,
      'ml_default',
      'unsigned_default',
      'default'
    ].filter(Boolean);

    let lastError = null;

    for (const preset of presetOptions) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Upload successful with preset: ${preset}`);
          return {
            success: true,
            url: data.secure_url
          };
        } else {
          const errorData = await response.json().catch(() => null);
          lastError = `Preset '${preset}' failed: ${response.statusText}${errorData ? ` - ${errorData.error?.message}` : ''}`;
          console.warn(lastError);
        }
      } catch (error) {
        lastError = `Preset '${preset}' error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.warn(lastError);
      }
    }

    // If all presets fail, throw the last error
    throw new Error(`All upload presets failed. Last error: ${lastError}`);
  } catch (error) {
    console.warn('Cloudinary upload failed, falling back to base64:', error);
    return await convertToBase64(file);
  }
};

/**
 * Main upload function that tries Cloudinary first, then falls back to base64
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
  return await uploadToCloudinary(file);
};