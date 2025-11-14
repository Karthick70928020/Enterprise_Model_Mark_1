import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const LogVerification: React.FC = () => {
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerifyLogs = () => {
    // Mock verification
    setVerificationResult({
      verified: true,
      totalBlocks: 156,
      corruptedBlocks: 0,
      verificationTime: '2.3s',
      lastVerified: new Date().toISOString()
    });
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Log Verification</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Verify the integrity of the entire audit trail using cryptographic hashes and digital signatures.
          </p>
        </div>

        <button
          onClick={handleVerifyLogs}
          className="w-full btn-primary"
        >
          Run Integrity Verification
        </button>

        {verificationResult && (
          <div className={`p-4 rounded-lg ${
            verificationResult.verified 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {verificationResult.verified ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-semibold ${
                verificationResult.verified ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationResult.verified ? 'Verification Successful' : 'Verification Failed'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Blocks:</span>
                <span className="ml-2 font-medium">{verificationResult.totalBlocks}</span>
              </div>
              <div>
                <span className="text-gray-600">Corrupted:</span>
                <span className="ml-2 font-medium text-red-600">
                  {verificationResult.corruptedBlocks}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 font-medium">{verificationResult.verificationTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Verified:</span>
                <span className="ml-2 font-medium">
                  {new Date(verificationResult.lastVerified).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogVerification;