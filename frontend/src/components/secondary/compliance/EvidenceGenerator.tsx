import React, { useState } from 'react';
import { DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

const EvidenceGenerator: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const handleGenerateEvidence = () => {
    setGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setGenerating(false);
      setLastGenerated(new Date().toISOString());
    }, 2000);
  };

  const evidenceTypes = [
    {
      name: 'System Integrity Proof',
      description: 'Cryptographic proof of system state and audit trail integrity',
      format: 'PDF + Digital Signature'
    },
    {
      name: 'Compliance Certificate',
      description: 'Certificate of compliance with regulatory standards',
      format: 'PDF + JSON'
    },
    {
      name: 'Incident Timeline',
      description: 'Detailed timeline of security incidents with cryptographic proof',
      format: 'PDF + Timeline Data'
    }
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Evidence Generator</h2>

      <div className="space-y-4 mb-6">
        {evidenceTypes.map((type, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">{type.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{type.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Format: {type.format}</span>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={handleGenerateEvidence}
          disabled={generating}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <div className="flex items-center justify-center space-x-2">
              <ClockIcon className="h-4 w-4 animate-spin" />
              <span>Generating Comprehensive Evidence Package...</span>
            </div>
          ) : (
            'Generate All Evidence Packages'
          )}
        </button>

        {lastGenerated && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Evidence generated successfully:</strong>{' '}
              {new Date(lastGenerated).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> All generated evidence includes cryptographic signatures 
          and can be used for legal proceedings, insurance claims, and regulatory compliance.
        </p>
      </div>
    </div>
  );
};

export default EvidenceGenerator;