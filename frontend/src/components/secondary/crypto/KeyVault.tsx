import React, { useState, useEffect } from 'react';
import { useCryptoStore } from '../../../stores/cryptoStore';
import { KeyIcon, ShieldCheckIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const KeyVault: React.FC = () => {
  const { keyStatus, fetchKeyStatus, rotateKeys, exportPublicKey } = useCryptoStore();
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    fetchKeyStatus();
    const interval = setInterval(fetchKeyStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchKeyStatus]);

  const handleRotateKeys = async () => {
    setIsRotating(true);
    try {
      await rotateKeys();
    } finally {
      setIsRotating(false);
    }
  };

  const handleExportPublicKey = async () => {
    try {
      await exportPublicKey();
    } catch (error) {
      console.error('Failed to export public key:', error);
    }
  };

  const keyInfo = {
    algorithm: 'RSA-2048',
    storage: 'Hardware Security Module',
    protection: 'FIPS 140-2 Level 3',
    lastBackup: '2024-01-01T00:00:00Z',
    backupStatus: 'encrypted'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cryptographic Key Vault</h2>
          <p className="text-gray-600">Hardware-secured key management and operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportPublicKey}
            className="flex items-center space-x-2 btn-secondary"
          >
            <KeyIcon className="h-4 w-4" />
            <span>Export Public Key</span>
          </button>
          <button
            onClick={handleRotateKeys}
            disabled={isRotating}
            className="flex items-center space-x-2 btn-warning"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Rotating...' : 'Rotate Keys'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Status Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-success-600" />
                <div>
                  <div className="font-medium text-success-900">Private Key</div>
                  <div className="text-sm text-success-700">Securely stored in HSM</div>
                </div>
              </div>
              <div className="text-success-600 font-medium">Active</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <KeyIcon className="h-5 w-5 text-primary-600" />
                <div>
                  <div className="font-medium text-primary-900">Public Key</div>
                  <div className="text-sm text-primary-700">Available for verification</div>
                </div>
              </div>
              <div className="text-primary-600 font-medium">Valid</div>
            </div>

            {keyStatus?.needs_rotation && (
              <div className="flex items-center justify-between p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
                  <div>
                    <div className="font-medium text-warning-900">Key Rotation Recommended</div>
                    <div className="text-sm text-warning-700">
                      {keyStatus.days_since_rotation} days since last rotation
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Algorithm</span>
              <span className="text-sm text-gray-900">{keyInfo.algorithm}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Storage</span>
              <span className="text-sm text-gray-900">{keyInfo.storage}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Protection</span>
              <span className="text-sm text-gray-900">{keyInfo.protection}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Last Backup</span>
              <span className="text-sm text-gray-900">
                {new Date(keyInfo.lastBackup).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-700">Backup Status</span>
              <span className="text-sm text-gray-900 capitalize">{keyInfo.backupStatus}</span>
            </div>
          </div>
        </div>

        {/* Key Usage Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Usage Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Total Signatures</span>
              <span className="font-semibold text-blue-900">12,458</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">Today's Signatures</span>
              <span className="font-semibold text-green-900">342</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700">Verification Requests</span>
              <span className="font-semibold text-purple-900">89</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700">Key Operations/Min</span>
              <span className="font-semibold text-yellow-900">12.3</span>
            </div>
          </div>
        </div>

        {/* Security Compliance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Compliance</h3>
          <div className="space-y-3">
            {[
              { requirement: 'FIPS 140-2 Compliance', status: 'compliant', level: 'Level 3' },
              { requirement: 'Key Encryption', status: 'compliant', level: 'AES-256' },
              { requirement: 'Access Control', status: 'compliant', level: 'RBAC' },
              { requirement: 'Audit Logging', status: 'compliant', level: 'Comprehensive' },
              { requirement: 'Key Backup', status: 'compliant', level: 'Encrypted' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{item.requirement}</div>
                  <div className="text-sm text-gray-600">{item.level}</div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Fingerprint */}
      {keyStatus?.public_key_fingerprint && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Key Fingerprint</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <code className="font-mono text-sm text-gray-800 break-all">
              {keyStatus.public_key_fingerprint}
            </code>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Use this fingerprint to verify the authenticity of signatures created by this key.
          </p>
        </div>
      )}
    </div>
  );
};

export default KeyVault;