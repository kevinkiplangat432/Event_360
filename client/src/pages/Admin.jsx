import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { user, isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Admin Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-accent-600 dark:text-accent-400 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome, Administrator {user?.username}. Manage the entire Event360 platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Cards */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              User Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage user accounts, roles, and permissions
            </p>
            <button className="text-sm btn-primary w-full">
              Manage Users
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Event Approvals
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Review and approve pending events
            </p>
            <button className="text-sm btn-primary w-full">
              Review Events
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              System Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View platform statistics and reports
            </p>
            <button className="text-sm btn-primary w-full">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;