import React from 'react';
import { ShieldExclamationIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const IntegrityAlerts: React.FC = () => {
  const integrityAlerts = [
    {
      id: 'int_alert_001',
      type: 'HASH_MISMATCH',
      component: 'Audit Trail Block #45',
      timestamp: '2024-01-01T10:05:00Z',
      description: 'Block hash does not match computed value',
      status: 'investigating',
      action: 'AUTO_CORRECTED'
    },
    {
      id: 'int_alert_002',
      type: 'SIGNATURE_INVALID',
      component: 'Log Entry #1234',
      timestamp: '2024-01-01T09:55:00Z',
      description: 'Digital signature verification failed',
      status: 'resolved',
      action: 'MANUAL_VERIFICATION'
    },
    {
      id: 'int_alert_003',
      type: 'CHAIN_BREAK',
      component: 'Audit Trail',
      timestamp: '2024-01-01T09:45:00Z',
      description: 'Hash chain continuity broken at block #23',
      status: 'resolved',
      action: 'AUTO_REPAIRED'
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <ShieldExclamationIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Integrity Alerts</h2>
      </div>

      <div className="space-y-4">
        {integrityAlerts.map((alert) => (
          <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {alert.status === 'resolved' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ShieldExclamationIcon className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium text-gray-900">{alert.type}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                alert.status === 'resolved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {alert.status.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">{alert.component}</p>
            <p className="text-sm text-gray-700 mb-3">{alert.description}</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-gray-700">
                Action: <span className="font-medium">{alert.action.replace('_', ' ')}</span>
              </span>
            </div>

            {alert.status !== 'resolved' && (
              <div className="mt-3 flex space-x-2">
                <button className="text-sm btn-primary">Investigate</button>
                <button className="text-sm btn-secondary">Mark Resolved</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            System Integrity: All critical issues resolved
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntegrityAlerts;