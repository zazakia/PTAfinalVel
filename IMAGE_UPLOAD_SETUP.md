# Image Upload Setup Guide

Your application now supports image uploads for income and expense receipt images. The system is currently configured to work immediately with base64 storage.

## Current Setup: Base64 Storage (Working Now!)

✅ **Ready to use immediately** - No setup required!

Your application currently uses base64 encoding to store images directly in localStorage. This means:
- **Works right now** - Upload images in Income and Expense forms
- **No external accounts needed** - Everything stored locally
- **Perfect for development** - Test all functionality immediately

## Option 1: Upgrade to Cloudinary (For Production)

### 1. Create Cloudinary Account
- Sign up at [https://cloudinary.com](https://cloudinary.com)
- Get your free account (includes 25GB storage)

### 2. Get Your Credentials
From your Cloudinary dashboard, copy:
- Cloud Name
- API Key
- API Secret

### 3. Create Upload Preset
1. Go to Settings > Upload presets
2. Click "Add upload preset"
3. Set preset name (e.g., "school_receipts")
4. Set signing mode to "Unsigned"
5. Configure any additional settings (image transformations, etc.)

### 4. Update Environment Variables
Edit your `.env` file:

```env
# Replace with your actual Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_actual_upload_preset
```

### 5. Restart Development Server
```bash
npm run dev
```

## Option 2: Base64 Storage (Development Only)

If you don't configure Cloudinary, the app will automatically use base64 encoding to store images directly in the database. This works for development but is **not recommended for production** due to:

- Large database size
- Performance issues
- Storage limitations

## Features

### ✅ What's Included
- **Drag & Drop Upload**: Click or drag images to upload
- **File Validation**: Automatically checks file type and size
- **Image Preview**: See uploaded images before saving
- **Progress Indicators**: Visual feedback during upload
- **Error Handling**: Clear error messages for failed uploads
- **Multiple Formats**: Supports JPG, PNG, WebP
- **Size Limits**: Maximum 5MB per image
- **Secure Storage**: Images stored securely in Cloudinary or database

### 🔧 Technical Details
- **Cloudinary Integration**: Automatic upload to cloud storage
- **Database Storage**: Fallback to base64 encoding
- **TypeScript Support**: Fully typed image upload functions
- **React Components**: Reusable ImageUpload component
- **Error Recovery**: Graceful fallback when upload fails

## Usage

### Income Forms
1. Go to Income Entry Form
2. Scroll to "Receipt Upload" section
3. Click or drag image to upload
4. Image will be saved with the transaction

### Expense Forms  
1. Go to Expenses
2. Click "Add Expense"
3. Find "Upload Receipt Image" section
4. Upload image along with expense details

## Troubleshooting

### Common Issues

**"Cloudinary configuration missing" error:**
- Check that environment variables are set correctly
- Restart the development server after changing .env
- Ensure upload preset exists and is set to "unsigned"

**Upload fails:**
- Check file size (must be under 5MB)
- Verify file type (JPG, PNG, WebP only)
- Check internet connection for Cloudinary uploads

**Images not displaying:**
- For Cloudinary: Check if image URL is accessible
- For base64: Check browser console for errors

### Development vs Production

**Development:**
- Use base64 storage for quick testing
- No external dependencies required
- Images stored in database

**Production:**
- Always use Cloudinary for scalability
- Configure proper upload presets
- Set up image transformations for optimization

## Security Notes

- Never expose API secrets in client-side code
- Use unsigned upload presets for client uploads
- Consider implementing upload restrictions
- Monitor usage to avoid exceeding quotas

## Next Steps

1. **Set up Cloudinary account** for production use
2. **Configure upload presets** with appropriate restrictions
3. **Test image uploads** in both income and expense forms
4. **Monitor storage usage** in Cloudinary dashboard
5. **Consider image optimization** for better performance