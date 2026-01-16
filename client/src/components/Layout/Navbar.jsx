// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Moon, 
  Sun, 
  Menu, 
  X,
  LogOut,
  Settings,
  Ticket,
  Shield,
  LayoutDashboard,
  Bell,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import RoleBadge from '../Common/RoleBadge';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isOrganizer, isAdmin, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            <span className="text-lg font-bold text-dark-900 dark:text-white">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-sm text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Events
            </Link>
            
            {isAuthenticated && isOrganizer() && (
              <Link to="/create-event" className="text-sm text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                <PlusCircle className="h-4 w-4 mr-1" />
                Create Event
              </Link>
            )}
            
            {isAuthenticated && (isOrganizer() || isAdmin()) && (
              <Link to="/dashboard" className="text-sm text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            )}
            
            {isAuthenticated && isAdmin() && (
              <Link to="/admin" className="text-sm text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-dark-700 dark:text-dark-300" />
              ) : (
                <Moon className="h-4 w-4 text-dark-700 dark:text-dark-300" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-xs font-medium text-dark-800 dark:text-white">{user.username}</p>
                        <RoleBadge role={user.role} className="text-xs" />
                      </div>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-dark-200 dark:border-dark-700 z-50">
                      <div className="p-3 border-b border-dark-100 dark:border-dark-700">
                        <p className="text-sm font-medium text-dark-900 dark:text-white">{user.username}</p>
                        <p className="text-xs text-dark-500 dark:text-dark-400">{user.email}</p>
                        <div className="mt-2">
                          <RoleBadge role={user.role} />
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700"
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </Link>
                        
                        <Link 
                          to="/my-tickets" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700"
                        >
                          <Ticket className="h-4 w-4 mr-3" />
                          My Tickets
                        </Link>
                        
                        <Link 
                          to="/settings" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Link>
                        
                        <div className="border-t border-dark-100 dark:border-dark-700 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-dark-50 dark:hover:bg-dark-700"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-3 py-2 text-sm bg-dark-100 dark:bg-dark-800 text-dark-800 dark:text-dark-200 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-dark-100 dark:bg-dark-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 text-dark-700 dark:text-dark-300" />
              ) : (
                <Menu className="h-4 w-4 text-dark-700 dark:text-dark-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-200 dark:border-dark-700">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/events" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
              >
                Events
              </Link>
              
              {isAuthenticated && isOrganizer() && (
                <Link 
                  to="/create-event" 
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                >
                  Create Event
                </Link>
              )}
              
              {isAuthenticated && (isOrganizer() || isAdmin()) && (
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                >
                  Dashboard
                </Link>
              )}
              
              {isAuthenticated && isAdmin() && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                >
                  Admin Panel
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <div className="border-t border-dark-200 dark:border-dark-700 my-2 pt-2">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/my-tickets" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                    >
                      My Tickets
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex space-x-3 px-4 pt-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-3 py-2 text-sm bg-dark-100 dark:bg-dark-800 text-dark-800 dark:text-dark-200 rounded-lg text-center"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;