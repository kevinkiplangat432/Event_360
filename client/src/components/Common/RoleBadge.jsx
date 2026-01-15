import React from 'react';

const RoleBadge = ({ role, className = '' }) => {
  const getRoleStyles = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'organizer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'attendee':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin':
        return '🛡️';
      case 'organizer':
        return '📅';
      case 'attendee':
        return '🎫';
      default:
        return '👤';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleStyles(role)} ${className}`}>
      <span className="mr-1">{getRoleIcon(role)}</span>
      {role?.charAt(0).toUpperCase() + role?.slice(1)}
    </span>
  );
};

export default RoleBadge;