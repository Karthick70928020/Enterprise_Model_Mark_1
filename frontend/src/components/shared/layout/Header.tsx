import React from 'react';
import { BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Project Aegis
            </h1>
            <p className="text-sm text-gray-500">
              Unified Security System
            </p>
          </div>
        </div>

        {/* Notifications and Status */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Primary</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Secondary</span>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;