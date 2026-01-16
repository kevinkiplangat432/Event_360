// src/utils/imageUpload.js
import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

// Validate image file
export const validateImage = (file) => {
  const errors = [];

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    errors.push('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.');
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push('File size exceeds 5MB limit.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Upload image to Cloudinary
export const uploadImage = async (file) => {
  try {
    // Validate the image first
    const validation = validateImage(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    formData.append('folder', 'event_posters');

    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${progress}%`);
        },
      }
    );

    if (response.data.secure_url) {
      return {
        success: true,
        url: response.data.secure_url,
        public_id: response.data.public_id,
        data: response.data
      };
    } else {
      throw new Error('Upload failed - no URL returned');
    }

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    };
  }
};

// Alternative upload function (alias for uploadImage)
export const uploadToCloudinary = uploadImage;

// Delete image from Cloudinary (if needed later)
export const deleteImage = async (publicId) => {
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        public_id: publicId,
        api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
        timestamp: Math.floor(Date.now() / 1000),
        signature: '' // You'd need to generate this server-side for security
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};