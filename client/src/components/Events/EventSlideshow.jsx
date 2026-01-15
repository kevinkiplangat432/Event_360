import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Ticket, 
  Users, 
  Shield, 
  Star,
  TrendingUp,
  CheckCircle,
  Award,
  Zap,
  Globe,
  Clock
} from 'lucide-react';
import { eventsAPI } from '../utils/api';
import EventSlideshow from '../components/Events/EventSlideshow';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setFeaturedEvents(response.data.slice(0, 3)); // Only show 3 featured
    } catch (error) {
      console.error('Error fetching featured events:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Seamless Event Creation",
      description: "Powerful tools to create and manage your events with ease"
    },
    {
      icon: <Ticket className="h-8 w-8" />,
      title: "Smart Digital Ticketing",
      description: "QR-based tickets with real-time validation and analytics"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Engagement",
      description: "Connect with attendees and build lasting relationships"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-level security for all transactions and data"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Optimized performance for seamless user experience"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Reach",
      description: "Manage events across different cities and countries"
    }
  ];

  const stats = [
    { label: "Events Hosted", value: "1,240+", icon: <Calendar /> },
    { label: "Active Users", value: "12,580+", icon: <Users /> },
    { label: "Tickets Issued", value: "58,900+", icon: <Ticket /> },
    { label: "Cities Covered", value: "35+", icon: <Globe /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Slideshow Section */}
      <section className="relative">
        <EventSlideshow />
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-dark-50 dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white mb-4">
              Everything You Need for Successful Events
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              From planning to execution, we provide the complete toolkit for 
              creating unforgettable event experiences
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

      {/* Featured Events */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-dark-900 dark:text-white">
                Featured Events
              </h2>
              <p className="text-dark-600 dark:text-dark-400 mt-2">
                Handpicked events you don't want to miss
              </p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0 btn-secondary">
              View All Events
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-dark-200 dark:bg-dark-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-dark-200 dark:bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-200 dark:bg-dark-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="card group hover:shadow-xl hover:border-primary-500/30 transition-all"
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-dark-400 mx-auto mb-4" />
              <p className="text-dark-600 dark:text-dark-400">
                No featured events available at the moment
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-50 dark:bg-dark-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white mb-4">
              Trusted by Event Professionals
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Join thousands of organizers who rely on our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-dark-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-dark-600 dark:text-dark-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Event Experience?
            </h2>
            <p className="text-primary-100 mb-8">
              Whether you're organizing or attending, Event360 delivers 
              exceptional experiences from start to finish
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
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

export default Home;