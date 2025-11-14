import React from 'react';
import { SystemStatus } from '../../../types/api';
import { CpuChipIcon, ServerIcon, WifiIcon } from '@heroicons/react/24/outline';

interface SystemHealthProps {
  status: SystemStatus | null;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ status }) => {
  const healthMetrics = [
    {
      name: 'CPU Usage',
      value: '45%',
      icon: CpuChipIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      name: 'Memory',
      value: '62%',
      icon: ServerIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      name: 'Network',
      value: '78%',
      icon: WifiIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    }
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
      
      {/* Health Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {healthMetrics.map((metric) => (
          <div key={metric.name} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${metric.bgColor} ${metric.color} mb-2`}>
              <metric.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-600">{metric.name}</p>
          </div>
        ))}
      </div>

      {/* System Status */}
      {status && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overall Health</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-900">
                {status.system_health}%
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active Connections</span>
            <span className="text-sm font-medium text-gray-900">
              {status.active_connections}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Blocked Threats</span>
            <span className="text-sm font-medium text-danger-600">
              {status.blocked_threats}
            </span>
          </div>
        </div>
      )}

      {/* Health Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>System Health</span>
          <span>{status?.system_health}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-success-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${status?.system_health || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;