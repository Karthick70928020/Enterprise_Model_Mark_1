import React from 'react';
import { ShieldCheckIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

interface ComplianceStatusProps {
  systemIntegrity: any;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ systemIntegrity }) => {
  const complianceChecks = [
    {
      name: 'Cryptographic Integrity',
      status: systemIntegrity?.checks?.key_manager ? 'pass' : 'fail',
      description: 'Key management system verification'
    },
    {
      name: 'Storage Integrity',
      status: systemIntegrity?.checks?.secure_storage ? 'pass' : 'fail',
      description: 'Secure storage system check'
    },
    {
      name: 'TOTP System',
      status: systemIntegrity?.checks?.totp_generator ? 'pass' : 'fail',
      description: 'Time-based authentication'
    },
    {
      name: 'Audit Trail',
      status: systemIntegrity?.checks?.audit_trail ? 'pass' : 'fail',
      description: 'Immutable log chain verification'
    }
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance & Integrity</h2>
      
      <div className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">System Integrity</p>
              <p className="text-sm text-gray-600">Overall security status</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            systemIntegrity?.system_integrity === 'healthy' 
              ? 'bg-success-100 text-success-800' 
              : 'bg-danger-100 text-danger-800'
          }`}>
            {systemIntegrity?.system_integrity ? 'Healthy' : 'Degraded'}
          </div>
        </div>

        {/* Compliance Checks */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 flex items-center space-x-2">
            <DocumentChartBarIcon className="h-4 w-4" />
            <span>Compliance Checks</span>
          </h3>
          
          {complianceChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{check.name}</p>
                <p className="text-sm text-gray-600">{check.description}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                check.status === 'pass' ? 'bg-success-500' : 'bg-danger-500'
              }`} />
            </div>
          ))}
        </div>

        {/* Insurance Readiness */}
        <div className="p-4 bg-success-50 rounded-lg border border-success-200">
          <h3 className="font-medium text-success-900 mb-2">Insurance Compliance</h3>
          <p className="text-sm text-success-700">
            System maintains cryptographic proof of all security events suitable for 
            cyber-insurance claims and regulatory compliance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStatus;