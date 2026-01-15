import React from 'react';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, isOrganizer, isAdmin } = useAuth();

  const stats = [
    { label: "Total Events", value: "12", icon: <Calendar className="h-5 w-5" />, change: "+2" },
    { label: "Total Attendees", value: "456", icon: <Users className="h-5 w-5" />, change: "+34" },
    { label: "Revenue", value: "KES 25,600", icon: <DollarSign className="h-5 w-5" />, change: "+12%" },
    { label: "Conversion Rate", value: "24%", icon: <TrendingUp className="h-5 w-5" />, change: "+3%" }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.username}! Here's your event overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Role-specific content */}
        {isOrganizer() && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Organizer Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-accent-300 dark:hover:border-accent-700 transition-colors text-left">
                <Calendar className="h-6 w-6 text-accent-600 dark:text-accent-400 mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">Create Event</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start a new event</p>
              </button>
              
              <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-accent-300 dark:hover:border-accent-700 transition-colors text-left">
                <Users className="h-6 w-6 text-accent-600 dark:text-accent-400 mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Events</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View all your events</p>
              </button>
              
              <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-accent-300 dark:hover:border-accent-700 transition-colors text-left">
                <DollarSign className="h-6 w-6 text-accent-600 dark:text-accent-400 mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">Revenue Reports</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View earnings & reports</p>
              </button>
            </div>
          </div>
        )}

        {isAdmin() && (
          <div className="card mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Admin Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Access full admin panel for system management.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;