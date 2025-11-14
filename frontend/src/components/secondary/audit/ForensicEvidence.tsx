import React from 'react';
import { DocumentMagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline';

const ForensicEvidence: React.FC = () => {
  const evidenceItems = [
    {
      id: 'evidence_001',
      type: 'SECURITY_BREACH',
      timestamp: '2024-01-01T10:15:00Z',
      severity: 'high',
      description: 'Unauthorized data access attempt detected',
      evidence: {
        source_ip: '192.168.1.150',
        user: 'unknown',
        files_accessed: ['sensitive_data.pdf'],
        action: 'BLOCKED'
      }
    },
    {
      id: 'evidence_002',
      timestamp: '2024-01-01T09:45:00Z',
      type: 'POLICY_VIOLATION',
      severity: 'medium',
      description: 'Large outbound data transfer',
      evidence: {
        source_ip: '192.168.1.100',
        data_size: '15.2 MB',
        destination: 'external-cloud.com',
        action: 'LOGGED'
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-800 bg-red-100';
      case 'medium':
        return 'text-yellow-800 bg-yellow-100';
      case 'low':
        return 'text-green-800 bg-green-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Forensic Evidence</h2>
        <DocumentMagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {evidenceItems.map((evidence) => (
          <div key={evidence.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(evidence.severity)}`}>
                  {evidence.severity.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">{evidence.type}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span>{new Date(evidence.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{evidence.description}</p>

            <div className="bg-gray-50 rounded p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Evidence Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(evidence.evidence).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex space-x-2">
              <button className="text-sm btn-secondary">View Full Log</button>
              <button className="text-sm btn-primary">Generate Report</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Load More Evidence →
        </button>
      </div>
    </div>
  );
};

export default ForensicEvidence;