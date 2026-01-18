import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users,
  Star,
  ChevronDown,
  X,
  AlertCircle,
  Grid,
  List
} from 'lucide-react';
import { eventsAPI } from '../utils/api';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all'  // Show all events by default for testing
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All', 'Music', 'Conference', 'Workshop', 'Sports', 
    'Networking', 'Art', 'Food', 'Technology', 'Business', 'Education'
  ];

  const cities = [
    'All Cities', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru',
    'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Naivasha'
  ];

  useEffect(() => {
    fetchEvents();
  }, [searchParams, page, filters.search]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12
      };
      
      // Only add status filter if it's not 'all'
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }
      if (filters.city && filters.city !== 'All Cities') {
        params.city = filters.city;
      }
      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const response = await eventsAPI.getAll(params);
      setEvents(response.data);
      
      setTotalPages(Math.ceil(response.data.length / 12));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'All Cities') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      search: '',
      status: 'all'  // Reset to show all events
    });
    setSearchParams({});
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">
            Discover Events
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Find your next unforgettable experience
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search events by name, venue, or description..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                    : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                    : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary inline-flex items-center justify-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {Object.values(filters).some(f => f && f !== 'approved') && (
                <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {Object.values(filters).filter(f => f && f !== 'approved').length}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                  Filter Events
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category === 'All' ? '' : category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city === 'All Cities' ? '' : city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="approved">Approved</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                      <option value="all">All Status</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Display */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-dark-600 dark:text-dark-400">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-dark-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              Try adjusting your filters or check back later
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-dark-600 dark:text-dark-400">
                Showing {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
              <div className="text-sm text-dark-500 dark:text-dark-400">
                Page {page} of {totalPages}
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <EventListItem key={event.id} event={event} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="h-4 w-4 transform rotate-90" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = page <= 3 ? i + 1 : 
                                  page >= totalPages - 2 ? totalPages - 4 + i : 
                                  page - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg ${
                          page === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="h-4 w-4 transform -rotate-90" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
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
      <div className="absolute top-3 right-3">
        <span className={`badge ${
          event.status === 'approved' ? 'badge-success' :
          event.status === 'pending' ? 'badge-warning' :
          event.status === 'cancelled' ? 'badge-error' : 'badge-dark'
        }`}>
          {event.status}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center text-sm text-dark-500 dark:text-dark-400">
        <Calendar className="h-4 w-4 mr-1" />
        {new Date(event.start_time).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })}
      </div>
      {event.average_rating > 0 && (
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
          <span className="font-medium">{event.average_rating.toFixed(1)}</span>
        </div>
      )}
    </div>

    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 line-clamp-1">
      {event.title}
    </h3>

    <p className="text-dark-600 dark:text-dark-400 mb-4 line-clamp-2">
      {event.description}
    </p>

    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center text-dark-500 dark:text-dark-400">
        <MapPin className="h-4 w-4 mr-2" />
        <span className="truncate">{event.venue}, {event.city}</span>
      </div>
      {event.capacity && (
        <div className="flex items-center text-dark-500 dark:text-dark-400">
          <Users className="h-4 w-4 mr-2" />
          <span>{event.capacity}</span>
        </div>
      )}
    </div>

    <div className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-700">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-dark-500 dark:text-dark-400">From</span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400 ml-2">
            KES 500
          </span>
        </div>
        <span className="text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-2 transition-transform">
          View Details →
        </span>
      </div>
    </div>
  </Link>
);

// Event List Item Component
const EventListItem = ({ event }) => (
  <Link
    to={`/events/${event.id}`}
    className="card group hover:shadow-xl transition-all duration-300"
  >
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/4">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={event.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'}
            alt={event.title}
            className="w-full h-48 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <span className="badge badge-primary text-xs">
              {event.category}
            </span>
          </div>
        </div>
      </div>

      <div className="md:w-2/4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-1">
            {event.title}
          </h3>
          <p className="text-dark-600 dark:text-dark-400 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-dark-500 dark:text-dark-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(event.start_time).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {event.venue}, {event.city}
          </div>
          
          {event.capacity && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {event.capacity} seats
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/4 flex flex-col items-end justify-between">
        <div>
          <span className={`badge ${
            event.status === 'approved' ? 'badge-success' :
            event.status === 'pending' ? 'badge-warning' :
            event.status === 'cancelled' ? 'badge-error' : 'badge-dark'
          }`}>
            {event.status}
          </span>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
            From KES 500
          </div>
          <div className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Starting price
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default Events;