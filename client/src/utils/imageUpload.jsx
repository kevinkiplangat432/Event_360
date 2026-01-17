const uploadToCloudinary = async (file) => {
  try {
    // For now, return a placeholder image to test event creation
    console.log('Using placeholder image for testing');
    const placeholderImages = [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop'
    ];
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    return randomImage;
    
  } catch (error) {
    console.error('Upload error:', error);
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';
  }
};

export { uploadToCloudinary };