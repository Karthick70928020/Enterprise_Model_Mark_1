import React, { useEffect } from 'react';
import { useSecondaryStore } from '../../../stores/secondary/secondaryStore';
import CryptoHealth from './CryptoHealth';
import KeyManagement from './KeyManagement';
import AuditIntegrity from './AuditIntegrity';
import ComplianceStatus from './ComplianceStatus';
import { RefreshIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const SecondaryDashboard: React.FC = () => {
  const {
    cryptoStatus,
    auditStatus,
    systemIntegrity,
    loading,
    fetchCryptoStatus,
    fetchAuditStatus,
    fetchSystemIntegrity,
    fetchPublicKey,
  } = useSecondaryStore();

  useEffect(() => {
    fetchCryptoStatus();
    fetchAuditStatus();
    fetchSystemIntegrity();
    fetchPublicKey();

    // Refresh every 15 seconds
    const interval = setInterval(() => {
      fetchCryptoStatus();
      fetchAuditStatus();
      fetchSystemIntegrity();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchCryptoStatus, fetchAuditStatus, fetchSystemIntegrity, fetchPublicKey]);

  const handleRefresh = () => {
    fetchCryptoStatus();
    fetchAuditStatus();
    fetchSystemIntegrity();
  };

  if (loading && !cryptoStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading secondary device data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Secondary Device</h1>
          <p className="text-gray-600">Cryptographic Control Unit - Secure Key Management</p>
        </div>
        <div className="flex items-center space-x-4">
          {systemIntegrity && (
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              systemIntegrity.system_integrity === 'healthy' 
                ? 'bg-success-50 text-success-700' 
                : 'bg-danger-50 text-danger-700'
            }`}>
              <ShieldCheckIcon className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">
                {systemIntegrity.system_integrity} Integrity
              </span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 btn-secondary"
          >
            <RefreshIcon className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Cryptographic System</h3>
          <div className="mt-2 flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                cryptoStatus?.key_initialized ? 'bg-success-500' : 'bg-danger-500'
              }`}
            />
            <p className="text-2xl font-semibold text-gray-900">
              {cryptoStatus?.key_initialized ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Audit Trail</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {auditStatus?.block_count || 0}
          </p>
          <p className="text-sm text-gray-600">Blocks</p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">TOTP System</h3>
          <div className="mt-2 flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                cryptoStatus?.totp_initialized ? 'bg-success-500' : 'bg-danger-500'
              }`}
            />
            <p className="text-lg font-semibold text-gray-900">
              {cryptoStatus?.totp_initialized ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Key Rotation</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {cryptoStatus?.days_since_rotation || 0}
          </p>
          <p className="text-sm text-gray-600">Days</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CryptoHealth cryptoStatus={cryptoStatus} />
        <AuditIntegrity auditStatus={auditStatus} />
        <KeyManagement />
        <ComplianceStatus systemIntegrity={systemIntegrity} />
      </div>
    </div>
  );
};

export default SecondaryDashboard;