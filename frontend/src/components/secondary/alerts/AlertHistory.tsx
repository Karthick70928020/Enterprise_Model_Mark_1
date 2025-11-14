import React, { useState } from 'react';
import { CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';

const AlertHistory: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const alertHistory = [
    {
      id: 'hist_001',
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'high',
      timestamp: '2024-01-01T10:15:00Z',
      resolved: '2024-01-01T10:20:00Z',
      description: 'Multiple failed login attempts from external IP',
      action: 'BLOCKED_IP'
    },
    {
      id: 'hist_002',
      type: 'DATA_EXFILTRATION',
      severity: 'critical',
      timestamp: '2024-01-01T10:10:00Z',
      resolved: '2024-01-01T10:12:00Z',
      description: 'Large outbound transfer to suspicious domain',
      action: 'TERMINATED_CONNECTION'
    },
    {
      id: 'hist_003',
      type: 'SYSTEM_WARNING',
      severity: 'medium',
      timestamp: '2024-01-01T09:45:00Z',
      resolved: '2024-01-01T09:50:00Z',
      description: 'High memory usage on primary device',
      action: 'AUTO_SCALED'
    }
  ];

  const filteredAlerts = filter === 'all' 
    ? alertHistory 
    : alertHistory.filter(alert => alert.severity === filter);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Alert History</h2>
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-4 w-4 text-gray-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-gray-900">{alert.type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <CalendarIcon className="h-3 w-3" />
                <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{alert.description}</p>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-600">Triggered: </span>
                <span className="text-gray-900">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Resolved: </span>
                <span className="text-gray-900">
                  {new Date(alert.resolved).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-600">Action Taken: </span>
              <span className="text-sm font-medium text-gray-900">
                {alert.action.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No alerts found for the selected filter.</p>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button className="text-sm text-gray-600 hover:text-gray-700">
          Load More
        </button>
        <span className="text-sm text-gray-500">
          Showing {filteredAlerts.length} of {alertHistory.length} alerts
        </span>
      </div>
    </div>
  );
};

export default AlertHistory;