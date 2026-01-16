// src/pages/CreateEvent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  Upload, 
  X,
  AlertCircle,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadToCloudinary } from '../utils/imageUpload';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, isOrganizer, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    address: '',
    city: '',
    country: 'Kenya',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    capacity: '',
    price: '',
    poster_url: '', // Now optional
    isPublic: true
  });

  const [imagePreview, setImagePreview] = useState('');

  // Check if user has permission to create events
  if (!isOrganizer() && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
            Organizer Access Required
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-4">
            You need to be an organizer to create events.
          </p>
        </div>
      </div>
    );
  }

  const categories = [
    'Music',
    'Conference',
    'Workshop',
    'Sports',
    'Networking',
    'Art',
    'Food',
    'Technology',
    'Business',
    'Education'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      
      setFormData(prev => ({
        ...prev,
        poster_url: cloudinaryUrl
      }));
      
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      poster_url: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation - REMOVED poster requirement
    if (!formData.title || !formData.venue || !formData.startDate) {
      setError('Please fill in all required fields (Title, Venue, and Start Date)');
      setLoading(false);
      return;
    }

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = formData.endDate ? new Date(`${formData.endDate}T${formData.endTime}`) : null;

      const eventData = {
        ...formData,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime ? endDateTime.toISOString() : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
        // If no poster_url, the backend will generate a cool background
        poster_url: formData.poster_url || null
      };

      // TODO: Replace with actual API call
      const response = await fetch('https://event-360-xg6h.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const result = await response.json();
      
      setSuccess('Event created successfully! It will be reviewed by admin before going live.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        venue: '',
        address: '',
        city: '',
        country: 'Kenya',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        capacity: '',
        price: '',
        poster_url: '',
        isPublic: true
      });
      setImagePreview('');
      
      // Redirect to events page after 2 seconds
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Create New Event
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Fill in the details below to create your event. Poster is optional - we'll create a cool background with your event title.
          </p>
          <div className="mt-4">
            <span className="badge badge-primary">
              Organizer: {user?.username}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-700 dark:text-green-400">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload - Now Optional */}
          <div className="card">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              <span className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Event Poster (Optional)
              </span>
            </h2>
            <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
              Upload a custom poster or we'll generate a beautiful background with your event title.
            </p>
            
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-dark-400 mx-auto mb-4" />
                  <p className="text-dark-600 dark:text-dark-400 mb-4">
                    Upload event poster (Max 5MB) - Optional
                  </p>
                  <label className="btn-primary cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                  <p className="text-sm text-dark-500 dark:text-dark-400 mt-4">
                    Or leave empty for auto-generated background
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rest of the form remains the same */}
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>

              {/* ... rest of the form fields remain unchanged ... */}
              {/* Description, Category, Price, Location, Date & Time, Capacity sections */}

              {/* Submit Button */}
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="btn-primary px-6"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;