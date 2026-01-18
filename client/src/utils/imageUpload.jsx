import { uploadToCloudinary as apiUpload } from './api';

const uploadToCloudinary = async (file) => {
  try {
    console.log('Uploading image to Cloudinary...');
    const imageUrl = await apiUpload(file);
    console.log('Image uploaded successfully:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';
  }
};

export { uploadToCloudinary };