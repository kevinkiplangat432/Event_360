import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Event360</span>
          </Link>
          <p className="text-gray-400 mb-4">
            School Project - Event Management System
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Event360. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;