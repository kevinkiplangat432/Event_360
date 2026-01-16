// src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Ticket,
  ChevronLeft,
  QrCode,
  AlertCircle,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI } from '../utils/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      // Mock data - replace with API call
      const mockEvent = {
        id: 1,
        title: "Tech Conference 2024",
        description: "Annual technology conference featuring industry leaders, workshops, and networking opportunities. Join us for three days of innovation and learning.",
        venue: "KICC",
        address: "Harambee Ave",
        city: "Nairobi",
        country: "Kenya",
        start_time: "2024-12-15T09:00:00",
        end_time: "2024-12-17T18:00:00",
        category: "Conference",
        poster_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop",
        capacity: 500,
        tickets_sold: 320,
        organizer: {
          name: "Tech Events Kenya",
          email: "contact@techevents.co.ke"
        },
        price: 5000,
        status: 'approved'
      };
      
      setEvent(mockEvent);
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: `/events/${id}/purchase` } });
      return;
    }

    // Proceed to purchase
    navigate(`/events/${id}/purchase`, { state: { quantity: ticketQuantity } });
  };

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setWishlisted(!wishlisted);
    // TODO: API call to add/remove from wishlist
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            {error || 'The event you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 btn-primary"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm mb-4">
                  {event.category}
                </div>
                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(event.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.venue}, {event.city}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-full ${wishlisted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'} transition-colors`}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? 'text-white' : 'text-white'}`} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">
                About This Event
              </h2>
              <p className="text-dark-700 dark:text-dark-300 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white">Date & Time</h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      {new Date(event.start_time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-dark-600 dark:text-dark-400">
                      {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white">Location</h3>
                    <p className="text-dark-600 dark:text-dark-400">{event.venue}</p>
                    <p className="text-dark-600 dark:text-dark-400">
                      {event.address}, {event.city}, {event.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white">Capacity</h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      {event.tickets_sold || 0} / {event.capacity || 'Unlimited'} tickets sold
                    </p>
                    {event.capacity && (
                      <div className="mt-2 w-full bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${((event.tickets_sold || 0) / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white">Duration</h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      {event.end_time 
                        ? `${Math.ceil((new Date(event.end_time) - new Date(event.start_time)) / (1000 * 60 * 60 * 24))} days`
                        : '1 day'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                Get Tickets
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 border-2 border-primary-500 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-dark-900 dark:text-white">
                        Standard Ticket
                      </h3>
                      <p className="text-sm text-dark-600 dark:text-dark-400">
                        General admission
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-600">
                        KES {event.price?.toLocaleString() || 'Free'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">
                      Includes:
                    </p>
                    <ul className="text-sm text-dark-600 dark:text-dark-400 space-y-1">
                      <li className="flex items-center">
                        <Ticket className="h-3 w-3 mr-2" />
                        Event access
                      </li>
                      <li className="flex items-center">
                        <QrCode className="h-3 w-3 mr-2" />
                        Digital ticket with QR code
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {event.capacity && event.tickets_sold >= event.capacity ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                  <p className="text-red-700 dark:text-red-400 text-center">
                    Sold Out
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
                        className="p-2 border border-dark-300 dark:border-dark-600 rounded-l-lg"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={event.capacity ? event.capacity - (event.tickets_sold || 0) : 10}
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-2 border-y border-dark-300 dark:border-dark-600 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => setTicketQuantity(prev => prev + 1)}
                        className="p-2 border border-dark-300 dark:border-dark-600 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-dark-50 dark:bg-dark-900 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-dark-600 dark:text-dark-400">Price</span>
                      <span className="font-semibold">KES {(event.price * ticketQuantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600 dark:text-dark-400">Quantity</span>
                      <span className="font-semibold">{ticketQuantity}</span>
                    </div>
                    <div className="border-t border-dark-200 dark:border-dark-700 mt-2 pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">KES {(event.price * ticketQuantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handlePurchase}
                disabled={event.capacity && event.tickets_sold >= event.capacity}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  event.capacity && event.tickets_sold >= event.capacity
                    ? 'bg-dark-300 dark:bg-dark-700 text-dark-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {event.capacity && event.tickets_sold >= event.capacity
                  ? 'Sold Out'
                  : isAuthenticated
                  ? 'Proceed to Checkout'
                  : 'Login to Purchase'
                }
              </button>
              
              {!isAuthenticated && (
                <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 text-center">
                  You need to be logged in to purchase tickets
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;