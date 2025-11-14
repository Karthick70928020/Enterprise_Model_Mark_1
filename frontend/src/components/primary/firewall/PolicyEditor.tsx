import React, { useState } from 'react';
import { 
  DocumentPlusIcon,
  DocumentTextIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  rules: any[];
  enabled: boolean;
  lastModified: string;
}

const PolicyEditor: React.FC = () => {
  const [policies, setPolicies] = useState<SecurityPolicy[]>([
    {
      id: '1',
      name: 'Default Web Security',
      description: 'Basic web traffic filtering policy',
      rules: [],
      enabled: true,
      lastModified: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Data Loss Prevention',
      description: 'Prevent sensitive data exfiltration',
      rules: [],
      enabled: true,
      lastModified: '2024-01-01T10:00:00Z'
    }
  ]);

  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');

  const handleCreatePolicy = () => {
    if (!newPolicyName.trim()) return;

    const newPolicy: SecurityPolicy = {
      id: Date.now().toString(),
      name: newPolicyName,
      description: 'New security policy',
      rules: [],
      enabled: true,
      lastModified: new Date().toISOString()
    };

    setPolicies([...policies, newPolicy]);
    setNewPolicyName('');
    setShowCreatePolicy(false);
  };

  const togglePolicy = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, enabled: !policy.enabled }
        : policy
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Security Policies</h2>
          <p className="text-gray-600">Manage and configure security policy sets</p>
        </div>
        <button
          onClick={() => setShowCreatePolicy(true)}
          className="flex items-center space-x-2 btn-primary"
        >
          <DocumentPlusIcon className="h-4 w-4" />
          <span>Create Policy</span>
        </button>
      </div>

      {/* Create Policy Modal */}
      {showCreatePolicy && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Policy</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Name
              </label>
              <input
                type="text"
                value={newPolicyName}
                onChange={(e) => setNewPolicyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter policy name"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreatePolicy}
                className="btn-primary"
              >
                Create Policy
              </button>
              <button
                onClick={() => setShowCreatePolicy(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className={`card cursor-pointer transition-all ${
              policy.enabled 
                ? 'border-primary-200 bg-primary-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
            onClick={() => togglePolicy(policy.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                  {policy.enabled && (
                    <CheckCircleIcon className="h-4 w-4 text-success-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{policy.rules.length} rules</span>
                  <span>Modified: {new Date(policy.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  policy.enabled
                    ? 'bg-success-100 text-success-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {policy.enabled ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to policy detail
                }}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {policies.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No policies</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new security policy.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreatePolicy(true)}
              className="btn-primary"
            >
              Create Policy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyEditor;