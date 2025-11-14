import React, { useState, useEffect } from 'react';
import { ShieldExclamationIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'block' | 'log';
  protocol: string;
  source: string;
  destination: string;
  port: string;
  enabled: boolean;
  priority: number;
}

const FirewallManager: React.FC = () => {
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<FirewallRule>>({
    action: 'block',
    protocol: 'tcp',
    enabled: true,
    priority: 100
  });

  useEffect(() => {
    // Mock firewall rules
    const mockRules: FirewallRule[] = [
      {
        id: 'rule-1',
        name: 'Block Malicious IPs',
        action: 'block',
        protocol: 'any',
        source: '10.0.0.100,192.168.1.200',
        destination: 'any',
        port: 'any',
        enabled: true,
        priority: 100
      },
      {
        id: 'rule-2',
        name: 'Allow HTTP/HTTPS',
        action: 'allow',
        protocol: 'tcp',
        source: 'any',
        destination: 'any',
        port: '80,443',
        enabled: true,
        priority: 50
      },
      {
        id: 'rule-3',
        name: 'Block Suspicious Ports',
        action: 'block',
        protocol: 'any',
        source: 'any',
        destination: 'any',
        port: '23,135,445,3389',
        enabled: true,
        priority: 80
      }
    ];
    setRules(mockRules);
  }, []);

  const addRule = () => {
    if (!newRule.name) return;
    
    const rule: FirewallRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name || 'New Rule',
      action: newRule.action || 'block',
      protocol: newRule.protocol || 'tcp',
      source: newRule.source || 'any',
      destination: newRule.destination || 'any',
      port: newRule.port || 'any',
      enabled: newRule.enabled !== false,
      priority: newRule.priority || 100
    };

    setRules([...rules, rule]);
    setNewRule({});
    setShowAddRule(false);
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'allow': return 'text-success-600 bg-success-50';
      case 'block': return 'text-danger-600 bg-danger-50';
      case 'log': return 'text-warning-600 bg-warning-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Firewall Management</h1>
          <p className="text-gray-600">Network security rules and access control</p>
        </div>
        <button
          onClick={() => setShowAddRule(true)}
          className="flex items-center space-x-2 btn-primary"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Firewall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{rules.length}</div>
          <div className="text-sm text-gray-600">Total Rules</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">
            {rules.filter(r => r.enabled).length}
          </div>
          <div className="text-sm text-gray-600">Active Rules</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">
            {rules.filter(r => r.action === 'block').length}
          </div>
          <div className="text-sm text-gray-600">Block Rules</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">156</div>
          <div className="text-sm text-gray-600">Blocks Today</div>
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Firewall Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter rule name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action
                  </label>
                  <select
                    value={newRule.action}
                    onChange={(e) => setNewRule({...newRule, action: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="allow">Allow</option>
                    <option value="block">Block</option>
                    <option value="log">Log</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protocol
                  </label>
                  <select
                    value={newRule.protocol}
                    onChange={(e) => setNewRule({...newRule, protocol: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="icmp">ICMP</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    value={newRule.source || ''}
                    onChange={(e) => setNewRule({...newRule, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="IP or any"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={newRule.destination || ''}
                    onChange={(e) => setNewRule({...newRule, destination: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="IP or any"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={newRule.port || ''}
                  onChange={(e) => setNewRule({...newRule, port: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Port number or any"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAddRule(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={addRule}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Firewall Rules</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protocol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source → Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Port
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule.id} className={rule.enabled ? '' : 'opacity-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                    <div className="text-sm text-gray-500">Priority: {rule.priority}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(rule.action)}`}>
                      {rule.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.protocol.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{rule.source}</div>
                    <div className="text-gray-500">→ {rule.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        rule.enabled ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-danger-600 hover:text-danger-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Firewall Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Firewall Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Firewall Engine</span>
              <span className="text-sm font-medium text-success-600">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Packet Inspection</span>
              <span className="text-sm font-medium text-success-600">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Deep Packet Inspection</span>
              <span className="text-sm font-medium text-success-600">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Threat Intelligence</span>
              <span className="text-sm font-medium text-success-600">Connected</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: '2 min ago', action: 'Blocked', source: '192.168.1.100', reason: 'Port scan' },
              { time: '5 min ago', action: 'Allowed', source: '10.0.0.50', reason: 'HTTP request' },
              { time: '8 min ago', action: 'Blocked', source: '203.0.113.5', reason: 'Malicious IP' },
              { time: '12 min ago', action: 'Logged', source: '192.168.1.150', reason: 'Suspicious activity' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <span className={`font-medium ${
                    activity.action === 'Blocked' ? 'text-danger-600' : 
                    activity.action === 'Allowed' ? 'text-success-600' : 'text-warning-600'
                  }`}>
                    {activity.action}
                  </span>
                  <span className="text-gray-600 ml-2">from {activity.source}</span>
                </div>
                <div className="text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirewallManager;