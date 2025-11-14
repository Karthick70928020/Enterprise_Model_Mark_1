import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ComputerDesktopIcon, ServerIcon } from '@heroicons/react/24/outline';

const DeviceSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const devices = [
    {
      id: 'primary',
      name: 'Primary Device',
      description: 'AI Security Engine',
      icon: ComputerDesktopIcon,
      path: '/primary',
      active: location.pathname.startsWith('/primary')
    },
    {
      id: 'secondary',
      name: 'Secondary Device',
      description: 'Cryptographic Control Unit',
      icon: ServerIcon,
      path: '/secondary',
      active: location.pathname.startsWith('/secondary')
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Selection</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => navigate(device.path)}
            className={`p-4 border rounded-lg text-left transition-all ${
              device.active
                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <device.icon className={`h-6 w-6 ${
                device.active ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <div>
                <div className={`font-medium ${
                  device.active ? 'text-primary-900' : 'text-gray-900'
                }`}>
                  {device.name}
                </div>
                <div className={`text-sm ${
                  device.active ? 'text-primary-700' : 'text-gray-600'
                }`}>
                  {device.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeviceSwitcher;