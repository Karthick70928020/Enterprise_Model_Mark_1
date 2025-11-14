import React, { useState } from 'react';
import { 
  ShieldExclamationIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface DLP Rule {
  id: string;
  name: string;
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  matches: number;
  lastMatch?: string;
}

const DLPController: React.FC = () => {
  const [rules, setRules] = useState<DLP Rule[]>([
    {
      id: '1',
      name: 'Credit Card Numbers',
      pattern: '\\b(?:\\d[ -]*?){13,16}\\b',
      severity: 'high',
      enabled: true,
      matches: 42,
      lastMatch: '2024-01-01T10:30:00Z'
    },
    {
      id: '2',
      name: 'Social Security Numbers',
      pattern: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
      severity: 'critical',
      enabled: true,
      matches: 15,
      lastMatch: '2024-01-01T09:15:00Z'
    },
    {
      id: '3',
      name: 'API Keys',
      pattern: '\\b[a-zA-Z0-9]{32,64}\\b',
      severity: 'medium',
      enabled: false,
      matches: 8,
      lastMatch: '2024-01-01T08:45:00Z'
    }
  ]);

  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<DLP Rule>>({
    name: '',
    pattern: '',
    severity: 'medium',
    enabled: true
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-100 text-danger-800';
      case 'high': return 'bg-warning-100 text-warning-800';
      case 'medium': return 'bg-primary-100 text-primary-800';
      case 'low': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.pattern) return;

    const rule: DLP Rule = {
      id: Date.now().toString(),
      name: newRule.name,
      pattern: newRule.pattern,
      severity: newRule.severity || 'medium',
      enabled: newRule.enabled || true,
      matches: 0
    };

    setRules([...rules, rule]);
    setNewRule({ name: '', pattern: '', severity: 'medium', enabled: true });
    setShowAddRule(false);
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const stats = {
    total: rules.length,
    active: rules.filter(rule => rule.enabled).length,
    matches: rules.reduce((sum, rule) => sum + rule.matches, 0),
    critical: rules.filter(rule => rule.severity === 'critical').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Data Loss Prevention</h2>
          <p className="text-gray-600">Monitor and prevent sensitive data exfiltration</p>
        </div>
        <button
          onClick={() => setShowAddRule(true)}
          className="flex items-center space-x-2 btn-primary"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Rules</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active Rules</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{stats.matches}</div>
          <div className="text-sm text-gray-600">Total Matches</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">{stats.critical}</div>
          <div className="text-sm text-gray-600">Critical Rules</div>
        </div>
      </div>

      {/* Add Rule Form */}
      {showAddRule && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add DLP Rule</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rule Name
              </label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter rule name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pattern (Regex)
              </label>
              <input
                type="text"
                value={newRule.pattern}
                onChange={(e) => setNewRule({...newRule, pattern: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                placeholder="Enter regular expression pattern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                value={newRule.severity}
                onChange={(e) => setNewRule({...newRule, severity: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddRule}
                className="btn-primary"
              >
                Add Rule
              </button>
              <button
                onClick={() => setShowAddRule(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">DLP Rules</h3>
        
        {rules.length === 0 ? (
          <div className="text-center py-8">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No DLP rules</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first data loss prevention rule.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 border rounded-lg ${
                  rule.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Rule Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                            rule.severity
                          )}`}
                        >
                          {rule.severity.toUpperCase()}
                        </span>
                        {!rule.enabled && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            DISABLED
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <code className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {rule.pattern}
                        </code>
                        <span>{rule.matches} matches</span>
                        {rule.lastMatch && (
                          <span>Last: {new Date(rule.lastMatch).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`p-2 rounded ${
                          rule.enabled
                            ? 'text-success-600 hover:bg-success-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
                      >
                        {rule.enabled ? (
                          <EyeIcon className="h-4 w-4" />
                        ) : (
                          <EyeSlashIcon className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 text-danger-600 hover:bg-danger-50 rounded"
                        title="Delete Rule"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DLPController;