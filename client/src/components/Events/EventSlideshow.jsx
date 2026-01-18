import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { eventsAPI } from '../../utils/api';

const EventSlideshow = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll({
        status: 'approved',
        upcoming: true,
        limit: 5
      });
      setFeaturedEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching featured events:', error);
      // Mock data for development
      setFeaturedEvents(getMockFeaturedEvents());
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  // Auto-advance slides
  useEffect(() => {
    if (featuredEvents.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredEvents.length]);

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-800">
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (featuredEvents.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-800">
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
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-900 to-dark-800">
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
                    View Event
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
    </div>
  );
};

export default EventSlideshow;