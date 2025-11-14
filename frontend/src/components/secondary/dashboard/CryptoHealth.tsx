import React from 'react';
import { CryptoStatus } from '../../../types/api';
import { KeyIcon, ClockIcon } from '@heroicons/react/24/outline';

interface CryptoHealthProps {
  cryptoStatus: CryptoStatus | null;
}

const CryptoHealth: React.FC<CryptoHealthProps> = ({ cryptoStatus }) => {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Cryptographic Health</h2>
      
      <div className="space-y-4">
        {/* Key Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <KeyIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Key Management</p>
              <p className="text-sm text-gray-600">RSA-2048 Private Key</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            cryptoStatus?.key_initialized 
              ? 'bg-success-100 text-success-800' 
              : 'bg-danger-100 text-danger-800'
          }`}>
            {cryptoStatus?.key_initialized ? 'Initialized' : 'Not Initialized'}
          </div>
        </div>

        {/* TOTP Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">TOTP System</p>
              <p className="text-sm text-gray-600">Time-based Authentication</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            cryptoStatus?.totp_initialized 
              ? 'bg-success-100 text-success-800' 
              : 'bg-danger-100 text-danger-800'
          }`}>
            {cryptoStatus?.totp_initialized ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* Key Rotation */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Key Rotation</p>
            <p className="text-sm text-gray-600">Days since last rotation</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            (cryptoStatus?.days_since_rotation || 0) > 20 
              ? 'bg-warning-100 text-warning-800' 
              : 'bg-success-100 text-success-800'
          }`}>
            {cryptoStatus?.days_since_rotation || 0} days
          </div>
        </div>

        {/* Public Key Fingerprint */}
        {cryptoStatus?.public_key_fingerprint && (
          <div className="p-3 bg-primary-50 rounded-lg">
            <p className="font-medium text-gray-900 mb-1">Public Key Fingerprint</p>
            <p className="text-sm font-mono text-primary-600 bg-primary-100 px-2 py-1 rounded">
              {cryptoStatus.public_key_fingerprint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoHealth;