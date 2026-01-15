import React from 'react';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RoleBadge from '../components/Common/RoleBadge';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.username}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <RoleBadge role={user?.role} />
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Status
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <div className="flex items-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Active</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Permissions</p>
                  <div className="mt-2 space-y-2">
                    {user?.role === 'admin' && (
                      <>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Manage all events</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Approve/reject events</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Manage users</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• View all statistics</p>
                      </>
                    )}
                    {user?.role === 'organizer' && (
                      <>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Create events</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Manage own events</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• View event analytics</p>
                      </>
                    )}
                    {user?.role === 'attendee' && (
                      <>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Browse events</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Register for events</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Purchase tickets</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">• Leave reviews</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;