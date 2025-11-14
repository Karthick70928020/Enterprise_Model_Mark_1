import React from 'react';
import { DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

const InsuranceReports: React.FC = () => {
  const insuranceReports = [
    {
      id: 'ins_2024_001',
      type: 'QUARTERLY_SECURITY_REPORT',
      period: 'Q4 2024',
      generated: '2024-01-01T10:00:00Z',
      status: 'ready',
      size: '2.4 MB'
    },
    {
      id: 'ins_2024_002',
      type: 'INCIDENT_REPORT',
      period: 'December 2024',
      generated: '2024-01-01T09:30:00Z',
      status: 'ready',
      size: '1.8 MB'
    },
    {
      id: 'ins_2024_003',
      type: 'COMPLIANCE_CERTIFICATE',
      period: 'Annual 2024',
      generated: '2024-01-01T08:45:00Z',
      status: 'ready',
      size: '0.9 MB'
    }
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Insurance Reports</h2>

      <div className="space-y-4">
        {insuranceReports.map((report) => (
          <div key={report.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{report.type}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{report.period}</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {report.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Generated: {new Date(report.generated).toLocaleDateString()}
              </div>
              <div className="text-gray-600">
                Size: {report.size}
              </div>
            </div>

            <div className="mt-3 flex space-x-2">
              <button className="flex items-center space-x-1 btn-primary text-sm">
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button className="text-sm btn-secondary">
                View Online
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Insurance Compliance</h3>
        <p className="text-sm text-yellow-700">
          All reports include cryptographic proof of system integrity and audit trail completeness, 
          suitable for cyber-insurance claims and regulatory requirements.
        </p>
      </div>
    </div>
  );
};

export default InsuranceReports;