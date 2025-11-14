import React, { useState } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    const baseClasses = "h-5 w-5";
    switch (type) {
      case 'error':
        return <BellIcon className={`${baseClasses} text-danger-500`} />;
      case 'warning':
        return <BellIcon className={`${baseClasses} text-warning-500`} />;
      case 'success':
        return <BellIcon className={`${baseClasses} text-success-500`} />;
      default:
        return <BellIcon className={`${baseClasses} text-primary-500`} />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-danger-500 text-xs text-white items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                        {notification.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action?.onClick();
                            }}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;