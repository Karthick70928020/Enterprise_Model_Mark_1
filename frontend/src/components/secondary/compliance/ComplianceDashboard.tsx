import React from 'react';
import { ShieldCheckIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

const ComplianceDashboard: React.FC = () => {
  const complianceStandards = [
    {
      name: 'GDPR',
      status: 'compliant',
      lastAudit: '2024-01-01',
      requirements: 45,
      met: 45
    },
    {
      name: 'HIPAA',
      status: 'compliant',
      lastAudit: '2024-01-01',
      requirements: 32,
      met: 32
    },
    {
      name: 'SOC 2',
      status: 'in-progress',
      lastAudit: '2024-01-01',
      requirements: 28,
      met: 25
    },
    {
      name: 'ISO 27001',
      status: 'compliant',
      lastAudit: '2024-01-01',
      requirements: 38,
      met: 38
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-50';
      case 'non-compliant':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <DocumentChartBarIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Compliance Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {complianceStandards.map((standard, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{standard.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(standard.status)}`}>
                {standard.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Requirements Met:</span>
                <span className="font-medium">
                  {standard.met}/{standard.requirements}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Audit:</span>
                <span className="font-medium">{standard.lastAudit}</span>
              </div>
            </div>

            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(standard.met / standard.requirements) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Compliance Status</h3>
        </div>
        <p className="text-sm text-blue-700">
          All critical compliance standards are met. System maintains comprehensive audit trails 
          suitable for regulatory requirements and insurance claims.
        </p>
      </div>
    </div>
  );
};

export default ComplianceDashboard;