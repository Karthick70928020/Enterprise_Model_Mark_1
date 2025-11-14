import React from 'react';

export type StatusType = 'online' | 'offline' | 'warning' | 'error' | 'loading';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  label?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  pulse = false,
  label
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2 w-2';
      case 'lg':
        return 'h-4 w-4';
      default:
        return 'h-3 w-3';
    }
  };

  const getColorClasses = () => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'offline':
        return 'bg-gray-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'error':
        return 'bg-red-400';
      case 'loading':
        return 'bg-blue-400 animate-pulse';
      default:
        return 'bg-gray-400';
    }
  };

  const getPulseClasses = () => {
    if (!pulse) return '';
    
    switch (status) {
      case 'online':
        return 'animate-pulse ring-2 ring-green-400 ring-opacity-50';
      case 'warning':
        return 'animate-pulse ring-2 ring-yellow-400 ring-opacity-50';
      case 'error':
        return 'animate-pulse ring-2 ring-red-400 ring-opacity-50';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`rounded-full ${getSizeClasses()} ${getColorClasses()} ${getPulseClasses()}`}
      />
      {label && (
        <span className="text-sm text-gray-600">{label}</span>
      )}
    </div>
  );
};

export default StatusIndicator;