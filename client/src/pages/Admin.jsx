import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Calendar, Users, BarChart3, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, adminAPI } from '../utils/api';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAdmin()) {
      fetchPendingEvents();
    }
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ status: 'pending' });
      setPendingEvents(response.data);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    }
  };

  const approveEvent = async (eventId) => {
    setLoading(true);
    try {
      await adminAPI.approveEvent(eventId, { action: 'approve', comment: 'Approved by admin' });
      setMessage('Event approved successfully!');
      fetchPendingEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error approving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const rejectEvent = async (eventId) => {
    setLoading(true);
    try {
      await adminAPI.approveEvent(eventId, { action: 'reject', comment: 'Rejected by admin' });
      setMessage('Event rejected successfully!');
      fetchPendingEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error rejecting event:', error);
    } finally {
      setLoading(false);
    }
  };

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

        {message && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-700 dark:text-green-400">{message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Admin Cards */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              <Users className="h-5 w-5 inline mr-2" />
              User Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage user accounts, roles, and permissions
            </p>
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="text-sm btn-primary w-full"
            >
              Manage Users
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              <Calendar className="h-5 w-5 inline mr-2" />
              Event Approvals
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Review and approve pending events ({pendingEvents.length} pending)
            </p>
            <button 
              onClick={() => document.getElementById('pending-events').scrollIntoView({ behavior: 'smooth' })}
              className="text-sm btn-primary w-full"
            >
              Review Events
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              <BarChart3 className="h-5 w-5 inline mr-2" />
              System Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View platform statistics and reports
            </p>
            <button 
              onClick={() => window.location.href = '/admin/analytics'}
              className="text-sm btn-primary w-full"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Pending Events Section */}
        <div id="pending-events" className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            <Clock className="h-6 w-6 inline mr-2" />
            Pending Event Approvals ({pendingEvents.length})
          </h2>
          
          {pendingEvents.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No pending events to review
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4">
                      <img
                        src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop'}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="md:w-2/4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <p><strong>Venue:</strong> {event.venue}, {event.city}</p>
                        <p><strong>Date:</strong> {new Date(event.start_time).toLocaleDateString()}</p>
                        <p><strong>Category:</strong> {event.category}</p>
                        <p><strong>Organizer:</strong> {event.organizer_name}</p>
                      </div>
                    </div>
                    
                    <div className="md:w-1/4 flex flex-col gap-2">
                      <button
                        onClick={() => approveEvent(event.id)}
                        disabled={loading}
                        className="btn-primary text-sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1 inline" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectEvent(event.id)}
                        disabled={loading}
                        className="btn-secondary text-sm"
                      >
                        <X className="h-4 w-4 mr-1 inline" />
                        Reject
                      </button>
                      <button
                        onClick={() => window.location.href = `/events/${event.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;