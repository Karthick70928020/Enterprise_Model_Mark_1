import React from 'react';
import { BellAlertIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SecurityAlerts: React.FC = () => {
  const securityAlerts = [
    {
      id: 'alert_001',
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'high',
      timestamp: '2024-01-01T10:15:00Z',
      description: 'Multiple failed login attempts detected',
      source: '192.168.1.150',
      status: 'active'
    },
    {
      id: 'alert_002',
      type: 'DATA_EXFILTRATION',
      severity: 'critical',
      timestamp: '2024-01-01T10:10:00Z',
      description: 'Large outbound data transfer to external IP',
      source: '192.168.1.100',
      status: 'investigating'
    },
    {
      id: 'alert_003',
      type: 'CERTIFICATE_EXPIRY',
      severity: 'medium',
      timestamp: '2024-01-01T09:45:00Z',
      description: 'SSL certificate expiring in 7 days',
      source: 'web-server-01',
      status: 'acknowledged'
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <BellAlertIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Security Alerts</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">3 Active</span>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-4">
        {securityAlerts.map((alert) => (
          <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getSeverityIcon(alert.severity)}
                <span className="font-medium text-current">{alert.type.replace('_', ' ')}</span>
              </div>
              <span className="text-xs text-current capitalize">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-sm text-current mb-3">{alert.description}</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-current">Source: {alert.source}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                alert.status === 'active' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {alert.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-3 flex space-x-2">
              <button className="text-sm btn-primary">Investigate</button>
              <button className="text-sm btn-secondary">Acknowledge</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button className="text-sm text-gray-600 hover:text-gray-700">
          View All Alerts
        </button>
        <button className="text-sm btn-secondary">
          Configure Alerts
        </button>
      </div>
    </div>
  );
};

export default SecurityAlerts;