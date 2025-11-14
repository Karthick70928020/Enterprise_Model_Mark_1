import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastManagerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastManager: React.FC<ToastManagerProps> = ({ toasts, onRemove }) => {
  const getToastStyles = (type: Toast['type']) => {
    const baseStyles = "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-l-4 border-success-500`;
      case 'error':
        return `${baseStyles} border-l-4 border-danger-500`;
      case 'warning':
        return `${baseStyles} border-l-4 border-warning-500`;
      case 'info':
        return `${baseStyles} border-l-4 border-primary-500`;
      default:
        return baseStyles;
    }
  };

  const getIconColor = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'text-success-500';
      case 'error': return 'text-danger-500';
      case 'warning': return 'text-warning-500';
      case 'info': return 'text-primary-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 ${getIconColor(toast.type)}`} />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{toast.title}</p>
                {toast.message && (
                  <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => onRemove(toast.id)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastManager;