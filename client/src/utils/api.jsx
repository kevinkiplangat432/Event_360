import axios from 'axios';

const API_URL = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('event-360')
  ? 'https://event-360-xg6h.onrender.com'
  : 'http://localhost:5555';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('event360-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('event360-token');
      localStorage.removeItem('event360-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getCurrentUser: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/api/events', { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`),
  addToWishlist: (id) => api.post(`/api/events/${id}/wishlist`),
  removeFromWishlist: (id) => api.delete(`/api/events/${id}/wishlist`),
  createReview: (id, data) => api.post(`/api/events/${id}/reviews`, data),
  getRegistrations: (id) => api.get(`/api/events/${id}/registrations`),
  approveEvent: (id, data) => api.post(`/api/events/${id}/approve`, data),
  getPendingEvents: () => api.get('/api/events/pending'),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  create: (data) => api.post('/api/orders', data),
  cancel: (id) => api.post(`/api/orders/${id}/cancel`),
};

// Payments API
export const paymentsAPI = {
  process: (data) => api.post('/api/payments', data),
  getById: (id) => api.get(`/api/payments/${id}`),
  getOrderPayments: (orderId) => api.get(`/api/payments/order/${orderId}`),
};

// Registrations API
export const registrationsAPI = {
  getAll: () => api.get('/api/registrations'),
  create: (data) => api.post('/api/registrations', data),
  cancel: (id) => api.delete(`/api/registrations/${id}`),
  getById: (id) => api.get(`/api/registrations/${id}`),
};

// Tickets API
export const ticketsAPI = {
  getAll: () => api.get('/api/tickets'),
  getById: (id) => api.get(`/api/tickets/${id}`),
  checkIn: (id) => api.post(`/api/tickets/${id}/check-in`),
  verify: (code) => api.get(`/api/tickets/verify/${code}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  updateProfile: (id, data) => api.put(`/api/users/${id}`, data),
  changePassword: (id, data) => api.put(`/api/users/${id}/change-password`, data),
  getWishlist: (id) => api.get(`/api/users/${id}/wishlist`),
  getNotifications: (id) => api.get(`/api/users/${id}/notifications`),
  markNotificationRead: (userId, notificationId) => 
    api.put(`/api/users/${userId}/notifications/${notificationId}/read`),
  getUserEvents: (id) => api.get(`/api/users/${id}/events`),
  getUserOrders: (id) => api.get(`/api/users/${id}/orders`),
};

// Admin API
export const adminAPI = {
  getPendingEvents: () => api.get('/api/admin/events/pending'),
  approveEvent: (id, data) => api.post(`/api/admin/events/${id}/approve`, data),
  updateUserRole: (id, data) => api.put(`/api/admin/users/${id}/role`, data),
  toggleUserStatus: (id, data) => api.put(`/api/admin/users/${id}/status`, data),
  getAllOrders: () => api.get('/api/admin/orders'),
  getStatistics: () => api.get('/api/admin/statistics'),
  createFirstAdmin: (data) => api.post('/api/admin/create-first-admin', data),
  seedDatabase: () => api.post('/api/admin/seed-database'),
};

// Cloudinary upload 
export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'event360_preset');
    
    // Fallback to Unsplash if Cloudinary fails
    const fallbackImages = [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd'
    ];
    
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    return `${randomImage}?w=800&auto=format&fit=crop`;
    
  } catch (error) {
    console.error('Upload failed, using fallback:', error);
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';
  }
};

export default api;