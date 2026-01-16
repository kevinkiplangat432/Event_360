// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { eventsAPI } from '../utils/api';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Fetch featured events (approved and upcoming)
      const featuredResponse = await eventsAPI.getAll({
        status: 'approved',
        upcoming: true,
        featured: true,
        limit: 5
      });
      setFeaturedEvents(featuredResponse.data || []);

      // Fetch more upcoming events
      const upcomingResponse = await eventsAPI.getAll({
        status: 'approved',
        upcoming: true,
        limit: 9
      });
      setUpcomingEvents(upcomingResponse.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Mock data for development
      setFeaturedEvents(getMockFeaturedEvents());
      setUpcomingEvents(getMockUpcomingEvents());
    } finally {
      setLoading(false);
    }
  };

  const getMockFeaturedEvents = () => {
    return [
      {
        id: 1,
        title: "Nairobi Tech Conference 2024",
        description: "Annual technology conference featuring industry leaders, workshops, and networking opportunities.",
        venue: "KICC",
        city: "Nairobi",
        start_time: "2024-12-15T09:00:00",
        poster_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop",
        category: "Conference"
      },
      {
        id: 2,
        title: "Mombasa Music Festival",
        description: "Three days of live music, food, and entertainment on the beautiful Mombasa coast.",
        venue: "Bamburi Beach",
        city: "Mombasa",
        start_time: "2024-11-20T16:00:00",
        poster_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop",
        category: "Music"
      },
      {
        id: 3,
        title: "Startup Business Workshop",
        description: "Learn how to launch and grow your startup from successful entrepreneurs.",
        venue: "Nairobi Garage",
        city: "Nairobi",
        start_time: "2024-12-05T10:00:00",
        poster_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop",
        category: "Workshop"
      }
    ];
  };

  const getMockUpcomingEvents = () => {
    return [
      {
        id: 4,
        title: "Art Exhibition Opening",
        description: "Contemporary African art exhibition featuring emerging artists.",
        venue: "National Museum",
        city: "Nairobi",
        start_time: "2024-11-25T18:00:00",
        poster_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop",
        category: "Art"
      },
      {
        id: 5,
        title: "Charity Run Marathon",
        description: "Annual marathon to raise funds for children's education.",
        venue: "Uhuru Park",
        city: "Nairobi",
        start_time: "2024-12-10T06:00:00",
        poster_url: "https://images.unsplash.com/photo-1552674605-db6ffd8facb5?w=800&auto=format&fit=crop",
        category: "Sports"
      },
      {
        id: 6,
        title: "Food & Wine Tasting",
        description: "Experience the finest Kenyan cuisine paired with selected wines.",
        venue: "Sankara Hotel",
        city: "Nairobi",
        start_time: "2024-11-30T19:00:00",
        poster_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop",
        category: "Food"
      }
    ];
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-800">
        {loading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : featuredEvents.length > 0 ? (
          <>
            <div className="relative h-[60vh]">
              {featuredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-dark-900/50 z-10"></div>
                  <img
                    src={event.poster_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="container mx-auto px-4">
                      <div className="max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm mb-6">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Featured Event
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                          {event.title}
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 mb-8">
                          <div className="flex items-center text-gray-300">
                            <MapPin className="h-5 w-5 mr-2" />
                            {event.venue}, {event.city}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Calendar className="h-5 w-5 mr-2" />
                            {new Date(event.start_time).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <Link
                          to={`/events/${event.id}`}
                          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          View Event Details
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
                aria-label="Previous slide"
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
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No featured events available</p>
              <Link 
                to="/create-event" 
                className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create First Event
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                Upcoming Events
              </h2>
              <p className="text-dark-600 dark:text-dark-400 mt-2">
                Discover events happening near you
              </p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
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
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded">
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
                      {new Date(event.start_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
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
                No upcoming events available
              </p>
              <Link 
                to="/create-event" 
                className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create First Event
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;