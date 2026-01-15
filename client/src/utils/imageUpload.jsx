export const uploadImage = async (file) => {
  // In production, upload to your cloud storage
  // For demo, return a mock URL
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(2)}?w=800&auto=format&fit=crop`,
        public_id: `event360_${Date.now()}`
      });
    }, 1000);
  });
};

export const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image (JPEG, PNG, WebP)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size should be less than 5MB' };
  }

  return { valid: true };
};