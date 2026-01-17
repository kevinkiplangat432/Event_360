import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  UserPlus, 
  CalendarPlus, 
  Database,
  AlertCircle,
  CheckCircle,
  Upload
} from 'lucide-react';

const AdminTools = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Mock data for seeding
  const mockEvents = [
    {
      title: "Tech Conference Nairobi 2024",
      description: "Annual technology conference featuring industry leaders, workshops, and networking opportunities.",
      venue: "KICC",
      address: "Harambee Avenue",
      city: "Nairobi",
      country: "Kenya",
      start_time: "2024-12-15T09:00:00",
      end_time: "2024-12-15T18:00:00",
      category: "Technology",
      capacity: 500,
      price: 5000,
      poster_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop"
    },
    {
      title: "Mombasa Music Festival",
      description: "Three days of live music, food, and entertainment on the beautiful Mombasa coast.",
      venue: "Bamburi Beach",
      address: "Mombasa-Malindi Road",
      city: "Mombasa",
      country: "Kenya",
      start_time: "2024-11-20T16:00:00",
      end_time: "2024-11-22T23:00:00",
      category: "Music",
      capacity: 2000,
      price: 2500,
      poster_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop"
    }
  ];

  const seedDatabase = async () => {
    if (!isAdmin()) {
      setError('Admin access required');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Database seeded successfully with sample events!');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError('Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  const createFirstAdmin = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/create-first-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          email: 'admin@eventhub.com',
          password: 'Admin123!' 
        })
      });

      if (response.ok) {
        setMessage('First admin account created successfully!');
      } else {
        setError('Failed to create admin account');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
            Admin Access Required
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            You need administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              Admin Tools
            </h1>
          </div>
          <p className="text-dark-600 dark:text-dark-400">
            Welcome, Administrator {user?.username}. Manage the EventHub platform.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-700 dark:text-green-400">{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Seeding Card */}
          <div className="card">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-4">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900 dark:text-white mb-1">
                  Seed Database
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Populate database with sample events and users
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-dark-500 dark:text-dark-400 mb-2">
                This will create:
              </p>
              <ul className="text-sm text-dark-600 dark:text-dark-400 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  2 Sample events with Cloudinary posters
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Pre-filled event categories
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Test user accounts
                </li>
              </ul>
            </div>
            
            <button
              onClick={seedDatabase}
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Seeding...' : 'Seed Database'}
            </button>
          </div>

          {/* Create First Admin Card */}
          <div className="card">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900 dark:text-white mb-1">
                  Create First Admin
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Initialize the first administrator account
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-dark-500 dark:text-dark-400">
                Use this only if no admin accounts exist. Creates a default admin:
              </p>
              <div className="mt-2 text-xs text-dark-600 dark:text-dark-400 bg-dark-100 dark:bg-dark-800 p-2 rounded">
                <p>Email: admin@eventhub.com</p>
                <p>Password: Admin123!</p>
              </div>
            </div>
            
            <button
              onClick={createFirstAdmin}
              disabled={loading}
              className="w-full btn-secondary"
            >
              {loading ? 'Creating...' : 'Create First Admin'}
            </button>
          </div>

          {/* Create Event Card */}
          <div className="card md:col-span-2">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-4">
                <CalendarPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900 dark:text-white mb-1">
                  Quick Event Creation
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Create events directly as admin (no approval needed)
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
                Admin-created events are automatically approved.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = '/create-event'}
                className="flex-1 btn-primary"
              >
                <CalendarPlus className="h-4 w-4 mr-2 inline" />
                Create Event
              </button>
              
              <button
                onClick={() => window.location.href = '/admin'}
                className="flex-1 btn-secondary"
              >
                Go to Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;