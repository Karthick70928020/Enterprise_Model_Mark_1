import React, { useState, useEffect } from 'react';
import { useAuditStore } from '../../../stores/auditStore';
import { LinkIcon, DocumentMagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const HashChainViewer: React.FC = () => {
  const { auditStatus, fetchAuditStatus, verifyAuditIntegrity } = useAuditStore();
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    fetchAuditStatus();
    const interval = setInterval(fetchAuditStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchAuditStatus]);

  const handleVerifyIntegrity = async () => {
    try {
      const result = await verifyAuditIntegrity();
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  // Mock blockchain data
  const blockchain = [
    {
      index: 0,
      hash: '0000000000000000000000000000000000000000000000000000000000000000',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: '2024-01-01T00:00:00Z',
      data: 'Genesis Block',
      type: 'genesis',
      verified: true
    },
    {
      index: 1,
      hash: 'a1b2c3d4e5f678901234567890123456789012345678901234567890123456',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: '2024-01-01T00:01:00Z',
      data: 'System Initialization',
      type: 'system',
      verified: true
    },
    {
      index: 2,
      hash: 'b2c3d4e5f678901234567890123456789012345678901234567890123456789',
      previousHash: 'a1b2c3d4e5f678901234567890123456789012345678901234567890123456',
      timestamp: '2024-01-01T00:02:00Z',
      data: 'First Security Event',
      type: 'security',
      verified: true
    },
    {
      index: 3,
      hash: 'c3d4e5f678901234567890123456789012345678901234567890123456789012',
      previousHash: 'b2c3d4e5f678901234567890123456789012345678901234567890123456789',
      timestamp: '2024-01-01T00:03:00Z',
      data: 'User Authentication',
      type: 'authentication',
      verified: true
    }
  ];

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'genesis': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'authentication': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Hash Chain Viewer</h2>
          <p className="text-gray-600">Immutable audit trail with cryptographic verification</p>
        </div>
        <button
          onClick={handleVerifyIntegrity}
          className="flex items-center space-x-2 btn-primary"
        >
          <DocumentMagnifyingGlassIcon className="h-4 w-4" />
          <span>Verify Integrity</span>
        </button>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`card ${
          verificationResult.integrity ? 'border-success-200 bg-success-50' : 'border-danger-200 bg-danger-50'
        }`}>
          <div className="flex items-center space-x-3">
            {verificationResult.integrity ? (
              <CheckCircleIcon className="h-5 w-5 text-success-600" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-danger-600" />
            )}
            <div>
              <div className={`font-medium ${
                verificationResult.integrity ? 'text-success-900' : 'text-danger-900'
              }`}>
                Integrity {verificationResult.integrity ? 'Verified' : 'Compromised'}
              </div>
              <div className={`text-sm ${
                verificationResult.integrity ? 'text-success-700' : 'text-danger-700'
              }`}>
                {verificationResult.integrity 
                  ? `All ${blockchain.length} blocks are cryptographically linked and valid`
                  : verificationResult.error
                }
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blockchain Visualization */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hash Chain</h3>
          <div className="space-y-4">
            {blockchain.map((block, index) => (
              <div key={block.index} className="relative">
                {/* Connection Line */}
                {index > 0 && (
                  <div className="absolute left-6 top-0 w-0.5 h-8 bg-gray-300 -translate-y-full" />
                )}
                
                <div
                  className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedBlock?.index === block.index
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedBlock(block)}
                >
                  {/* Block Number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">#{block.index}</span>
                  </div>

                  {/* Block Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{block.data}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBlockTypeColor(block.type)}`}>
                        {block.type}
                      </span>
                      {block.verified && (
                        <CheckCircleIcon className="h-4 w-4 text-success-500" />
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-3 w-3" />
                        <code className="font-mono text-xs truncate">{block.hash}</code>
                      </div>
                      <div>Previous: <code className="font-mono text-xs truncate">{block.previousHash}</code></div>
                      <div>{new Date(block.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Details */}
        <div className="space-y-6">
          {selectedBlock ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Block Index</label>
                  <div className="text-sm text-gray-900 font-mono">#{selectedBlock.index}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hash</label>
                  <code className="text-sm text-gray-900 font-mono break-all">{selectedBlock.hash}</code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Hash</label>
                  <code className="text-sm text-gray-900 font-mono break-all">{selectedBlock.previousHash}</code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                  <div className="text-sm text-gray-900">{new Date(selectedBlock.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <div className="text-sm text-gray-900">{selectedBlock.data}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBlockTypeColor(selectedBlock.type)}`}>
                    {selectedBlock.type}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No block selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a block from the chain to view its details
              </p>
            </div>
          )}

          {/* Chain Statistics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chain Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Total Blocks</span>
                <span className="text-sm text-gray-900">{blockchain.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Chain Length</span>
                <span className="text-sm text-gray-900">{blockchain.length - 1} links</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">First Block</span>
                <span className="text-sm text-gray-900">{new Date(blockchain[0].timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">Last Block</span>
                <span className="text-sm text-gray-900">
                  {new Date(blockchain[blockchain.length - 1].timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashChainViewer;