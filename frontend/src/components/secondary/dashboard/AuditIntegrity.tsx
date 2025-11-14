import React from 'react';
import { AuditTrailStatus } from '../../../types/api';
import { DocumentCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface AuditIntegrityProps {
  auditStatus: AuditTrailStatus | null;
}

const AuditIntegrity: React.FC<AuditIntegrityProps> = ({ auditStatus }) => {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Integrity</h2>
      
      <div className="space-y-4">
        {/* Integrity Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <DocumentCheckIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Chain Integrity</p>
              <p className="text-sm text-gray-600">SHA-256 Hash Chain</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            auditStatus?.integrity_verified 
              ? 'bg-success-100 text-success-800' 
              : 'bg-danger-100 text-danger-800'
          }`}>
            {auditStatus?.integrity_verified ? 'Verified' : 'Compromised'}
          </div>
        </div>

        {/* Block Count */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Audit Blocks</p>
              <p className="text-sm text-gray-600">Total signed entries</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {auditStatus?.block_count || 0}
          </div>
        </div>

        {/* Timeline */}
        {auditStatus?.first_block_time && auditStatus?.last_block_time && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900 mb-2">Audit Timeline</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">First Block:</span>
                <span className="text-gray-900">
                  {new Date(auditStatus.first_block_time).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Block:</span>
                <span className="text-gray-900">
                  {new Date(auditStatus.last_block_time).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Current Hash */}
        {auditStatus?.current_chain_hash && (
          <div className="p-3 bg-warning-50 rounded-lg">
            <p className="font-medium text-gray-900 mb-1">Current Chain Hash</p>
            <p className="text-xs font-mono text-gray-600 truncate">
              {auditStatus.current_chain_hash}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditIntegrity;