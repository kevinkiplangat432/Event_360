// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Ticket, 
  Users, 
  Shield, 
  Zap,
  Globe,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { eventsAPI } from '../utils/api';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await eventsAPI.getAll({
        status: 'approved',
        upcoming: 'true',
        limit: 6
      });
      setFeaturedEvents(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured events:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Easy Event Creation",
      description: "Create and manage events effortlessly with our intuitive tools"
    },
    {
      icon: <Ticket className="h-8 w-8" />,
      title: "Digital Ticketing",
      description: "QR-based tickets with secure validation"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Focus",
      description: "Connect with attendees and build relationships"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Bank-level security for all transactions"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast Performance",
      description: "Optimized for seamless user experience"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Manage events across different locations"
    }
  ];

  const stats = [
    { label: "Events Hosted", value: "850+", icon: <Calendar /> },
    { label: "Happy Users", value: "8,420+", icon: <Users /> },
    { label: "Tickets Sold", value: "32,150+", icon: <Ticket /> },
    { label: "Cities", value: "28+", icon: <Globe /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-800">
        {loading ? (
          <div className="h-[70vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : featuredEvents.length > 0 ? (
          <>
            <div className="relative h-[70vh]">
              {featuredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-dark-900/50 z-10"></div>
                  <img
                    src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="container mx-auto px-4">
                      <div className="max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm mb-6">
                          Featured Event
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                          {event.title}
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 mb-8">
                          <div className="flex items-center text-gray-300">
                            <MapPin className="h-5 w-5 mr-2" />
                            {event.venue}, {event.city}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Calendar className="h-5 w-5 mr-2" />
                            {new Date(event.start_time).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="h-5 w-5 mr-2" />
                            {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <Link
                          to={`/events/${event.id}`}
                          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          View Details
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex space-x-2">
                {featuredEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'w-8 bg-primary-600' 
                        : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No featured events available</p>
            </div>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-dark-50 dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white mb-4">
              Everything You Need for Successful Events
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              From planning to execution, we provide complete tools for creating unforgettable experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:border-primary-500/50 group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-dark-900 dark:text-white">
                Upcoming Events
              </h2>
              <p className="text-dark-600 dark:text-dark-400 mt-2">
                Discover events happening near you
              </p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0 btn-primary">
              View All Events
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-dark-200 dark:bg-dark-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-dark-200 dark:bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-200 dark:bg-dark-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-dark-400 mx-auto mb-4" />
              <p className="text-dark-600 dark:text-dark-400">
                No upcoming events available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto">
              Join event organizers and attendees who rely on our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-dark-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Event Experience?
            </h2>
            <p className="text-gray-300 mb-8">
              Whether organizing or attending, EventHub delivers exceptional experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Get Started Free
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/events" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }) => (
  <Link
    to={`/events/${event.id}`}
    className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="relative overflow-hidden rounded-lg mb-4">
      <img
        src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'}
        alt={event.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3">
        <span className="badge badge-primary">
          {event.category}
        </span>
      </div>
    </div>
    
    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 line-clamp-1">
      {event.title}
    </h3>
    
    <p className="text-dark-600 dark:text-dark-400 mb-4 line-clamp-2">
      {event.description}
    </p>
    
    <div className="flex items-center justify-between text-sm text-dark-500 dark:text-dark-400">
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        {new Date(event.start_time).toLocaleDateString()}
      </div>
      <div className="flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        {event.city}
      </div>
    </div>
  </Link>
);

export default Home;