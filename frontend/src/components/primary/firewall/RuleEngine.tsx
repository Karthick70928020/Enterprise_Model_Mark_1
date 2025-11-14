import React from 'react';
import { FirewallRule, RuleAction } from '../../../types/firewall';
import RuleForm from './RuleForm';
import { 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon,
  PencilSquareIcon 
} from '@heroicons/react/24/outline';

interface RuleEngineProps {
  rules: FirewallRule[];
  loading: boolean;
  onToggleRule: (ruleId: string, enabled: boolean) => void;
  onDeleteRule: (ruleId: string) => void;
  onUpdateRule: (ruleId: string, rule: Partial<FirewallRule>) => void;
  showAddRule: boolean;
  onAddRule: (rule: Partial<FirewallRule>) => void;
  onCloseAddRule: () => void;
}

const RuleEngine: React.FC<RuleEngineProps> = ({
  rules,
  loading,
  onToggleRule,
  onDeleteRule,
  onUpdateRule,
  showAddRule,
  onAddRule,
  onCloseAddRule
}) => {
  const [editingRule, setEditingRule] = useState<FirewallRule | null>(null);

  const getActionColor = (action: RuleAction) => {
    switch (action) {
      case RuleAction.ALLOW:
        return 'bg-success-100 text-success-800';
      case RuleAction.BLOCK:
        return 'bg-danger-100 text-danger-800';
      case RuleAction.LOG:
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 100) return 'bg-danger-500';
    if (priority >= 80) return 'bg-warning-500';
    if (priority >= 50) return 'bg-primary-500';
    return 'bg-success-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-lg text-gray-600">Loading rules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Rule Form */}
      {showAddRule && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Rule</h3>
          <RuleForm
            onSubmit={onAddRule}
            onCancel={onCloseAddRule}
          />
        </div>
      )}

      {/* Edit Rule Form */}
      {editingRule && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Rule</h3>
          <RuleForm
            rule={editingRule}
            onSubmit={(ruleData) => {
              onUpdateRule(editingRule.id, ruleData);
              setEditingRule(null);
            }}
            onCancel={() => setEditingRule(null)}
          />
        </div>
      )}

      {/* Rules List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Firewall Rules</h3>
        
        {rules.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg">No rules configured</div>
            <p className="text-gray-400 mt-1">Create your first firewall rule to get started</p>
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
                    {/* Priority Indicator */}
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getPriorityColor(rule.priority)}`}
                        title={`Priority: ${rule.priority}`}
                      />
                    </div>

                    {/* Rule Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(
                            rule.action
                          )}`}
                        >
                          {rule.action.toUpperCase()}
                        </span>
                        {!rule.enabled && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            DISABLED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                      
                      {/* Rule Conditions */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {rule.conditions.map((condition, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                          >
                            {condition.type}: {condition.value}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleRule(rule.id, !rule.enabled)}
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
                        onClick={() => setEditingRule(rule)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                        title="Edit Rule"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDeleteRule(rule.id)}
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

export default RuleEngine;