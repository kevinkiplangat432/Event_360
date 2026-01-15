import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();

  // Mock data
  const event = {
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
    capacity: 500
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 text-white">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Date & Time</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(event.start_time).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">{event.venue}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {event.address}, {event.city}, {event.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Capacity</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {event.capacity} attendees
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Duration</h3>
                    <p className="text-gray-600 dark:text-gray-400">3 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get Tickets
              </h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 border-2 border-blue-500 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Standard Ticket
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        General admission
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        KES 5,000
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;