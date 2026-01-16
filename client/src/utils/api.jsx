// src/utils/api.js - Updated with Render URL
import axios from 'axios';

// Use Render URL if available, otherwise localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'https://event-360-kca7.onrender.com';

console.log('API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
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
  // Admin functions
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

// Cloudinary upload utility
export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'event360_preset'); // Replace with your preset
    
    // You would replace this with your actual Cloudinary upload endpoint
    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export default api;