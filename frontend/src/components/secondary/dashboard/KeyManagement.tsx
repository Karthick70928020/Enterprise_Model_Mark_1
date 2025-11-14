import React from 'react';
import { KeyIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const KeyManagement: React.FC = () => {
  const handleKeyRotation = async () => {
    // Implement key rotation logic
    console.log('Initiating key rotation...');
  };

  const handleExportPublicKey = async () => {
    // Implement public key export
    console.log('Exporting public key...');
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Management</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-primary-50 rounded-lg">
          <h3 className="font-medium text-primary-900 mb-2">Key Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-primary-700">Algorithm:</span>
              <span className="text-primary-900">RSA-2048</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Signature Scheme:</span>
              <span className="text-primary-900">RSA-PSS-SHA256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Storage:</span>
              <span className="text-primary-900">Hardware Secure</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleKeyRotation}
            className="w-full flex items-center justify-center space-x-2 btn-warning"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Rotate Cryptographic Keys</span>
          </button>

          <button
            onClick={handleExportPublicKey}
            className="w-full flex items-center justify-center space-x-2 btn-secondary"
          >
            <KeyIcon className="h-4 w-4" />
            <span>Export Public Key</span>
          </button>
        </div>

        <div className="p-3 bg-warning-50 rounded-lg">
          <p className="text-sm text-warning-800">
            <strong>Security Notice:</strong> Key rotation will invalidate all existing signatures. 
            Ensure proper backup procedures are followed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyManagement;