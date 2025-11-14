import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const RegulatoryChecks: React.FC = () => {
  const regulatoryChecks = [
    {
      requirement: 'Data Encryption at Rest',
      standard: 'GDPR Article 32',
      status: 'compliant',
      lastVerified: '2024-01-01T10:30:00Z'
    },
    {
      requirement: 'Audit Trail Maintenance',
      standard: 'HIPAA §164.312',
      status: 'compliant',
      lastVerified: '2024-01-01T10:30:00Z'
    },
    {
      requirement: 'Access Control Logging',
      standard: 'SOC 2 CC6.1',
      status: 'compliant',
      lastVerified: '2024-01-01T10:25:00Z'
    },
    {
      requirement: 'Incident Response Reporting',
      standard: 'ISO 27001 A.16',
      status: 'non-compliant',
      lastVerified: '2024-01-01T10:20:00Z'
    }
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Regulatory Checks</h2>

      <div className="space-y-4">
        {regulatoryChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{check.requirement}</h3>
              <p className="text-sm text-gray-600 mt-1">{check.standard}</p>
              <p className="text-xs text-gray-500 mt-1">
                Last verified: {new Date(check.lastVerified).toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {check.status === 'compliant' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                check.status === 'compliant' ? 'text-green-600' : 'text-red-600'
              }`}>
                {check.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Compliance Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-gray-600">Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-gray-600">Non-compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">75%</div>
            <div className="text-gray-600">Overall</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryChecks;