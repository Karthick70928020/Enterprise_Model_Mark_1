import React from 'react';
import { DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface AuditTrailProps {
  auditData?: any;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ auditData }) => {
  const mockAuditData = [
    {
      id: 'audit_001',
      timestamp: '2024-01-01T10:30:00Z',
      event: 'LOG_SIGNED',
      device: 'primary_device_001',
      hash: 'a1b2c3d4e5f6...',
      signature: 'sig_12345',
      status: 'verified'
    },
    {
      id: 'audit_002',
      timestamp: '2024-01-01T10:25:00Z',
      event: 'KEY_ROTATION',
      device: 'secondary_device',
      hash: 'f6e5d4c3b2a1...',
      signature: 'sig_12346',
      status: 'verified'
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <ShieldCheckIcon className="h-4 w-4" />
          <span>Chain Integrity Verified</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockAuditData.map((audit) => (
          <div key={audit.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{audit.event}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(audit.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Device:</span>
                <span className="ml-2 text-gray-900">{audit.device}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 text-green-600 font-medium">{audit.status}</span>
              </div>
            </div>
            
            <div className="mt-2">
              <span className="text-gray-600 text-sm">Hash:</span>
              <p className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded mt-1">
                {audit.hash}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button className="btn-secondary text-sm">
          Export Audit Log
        </button>
        <span className="text-sm text-gray-500">
          Showing {mockAuditData.length} entries
        </span>
      </div>
    </div>
  );
};

export default AuditTrail;