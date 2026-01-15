import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Discover Events",
      description: "Find amazing events happening near you"
    },
    {
      icon: <Ticket className="h-8 w-8" />,
      title: "Easy Booking",
      description: "Book tickets with just a few clicks"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Connect",
      description: "Meet people with similar interests"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Amazing{' '}
            <span className="text-blue-600 dark:text-blue-400">Events</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            From concerts and conferences to workshops and networking events. 
            Find your next unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg inline-flex items-center justify-center">
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/register" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-8 rounded-lg">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Event360?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;