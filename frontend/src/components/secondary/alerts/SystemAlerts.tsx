import React from 'react';
import { CpuChipIcon, ServerIcon } from '@heroicons/react/24/outline';

const SystemAlerts: React.FC = () => {
  const systemAlerts = [
    {
      id: 'sys_alert_001',
      component: 'Primary Device',
      type: 'HIGH_CPU_USAGE',
      severity: 'medium',
      timestamp: '2024-01-01T10:20:00Z',
      description: 'CPU usage above 85% for 5 minutes',
      value: '87%'
    },
    {
      id: 'sys_alert_002',
      component: 'Secondary Device',
      type: 'MEMORY_WARNING',
      severity: 'low',
      timestamp: '2024-01-01T10:15:00Z',
      description: 'Memory usage approaching threshold',
      value: '78%'
    },
    {
      id: 'sys_alert_003',
      component: 'Database',
      type: 'CONNECTION_POOL',
      severity: 'medium',
      timestamp: '2024-01-01T10:10:00Z',
      description: 'Database connection pool at 90% capacity',
      value: '90%'
    }
  ];

  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'Primary Device':
        return <CpuChipIcon className="h-5 w-5 text-blue-500" />;
      case 'Secondary Device':
        return <ServerIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ServerIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h2>

      <div className="space-y-4">
        {systemAlerts.map((alert) => (
          <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getComponentIcon(alert.component)}
                <span className="font-medium text-gray-900">{alert.component}</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {alert.severity.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-2">{alert.description}</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
              <span className="font-medium text-gray-900">{alert.value}</span>
            </div>

            <div className="mt-3 flex space-x-2">
              <button className="text-sm btn-secondary">Details</button>
              <button className="text-sm text-gray-600 hover:text-gray-700">
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">System Health</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">2</div>
            <div className="text-gray-600">Normal</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">1</div>
            <div className="text-gray-600">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">0</div>
            <div className="text-gray-600">Critical</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAlerts;