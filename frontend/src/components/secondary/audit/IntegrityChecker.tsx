import React from 'react';
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const IntegrityChecker: React.FC = () => {
  const integrityChecks = [
    {
      name: 'Hash Chain Integrity',
      status: 'pass',
      description: 'SHA-256 hash chain verification',
      lastCheck: '2024-01-01T10:30:00Z'
    },
    {
      name: 'Digital Signatures',
      status: 'pass',
      description: 'RSA-PSS signature validation',
      lastCheck: '2024-01-01T10:30:00Z'
    },
    {
      name: 'Timestamp Validation',
      status: 'pass',
      description: 'TOTP-based timestamp verification',
      lastCheck: '2024-01-01T10:30:00Z'
    },
    {
      name: 'Storage Integrity',
      status: 'warning',
      description: 'Encrypted storage health check',
      lastCheck: '2024-01-01T10:25:00Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <ShieldCheckIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-700 bg-green-50';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50';
      default:
        return 'text-red-700 bg-red-50';
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrity Checks</h2>
      
      <div className="space-y-3">
        {integrityChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(check.status)}
              <div>
                <p className="font-medium text-gray-900">{check.name}</p>
                <p className="text-sm text-gray-600">{check.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                {check.status.toUpperCase()}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(check.lastCheck).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>System Integrity:</strong> All critical cryptographic checks passed. System is secure.
        </p>
      </div>
    </div>
  );
};

export default IntegrityChecker;