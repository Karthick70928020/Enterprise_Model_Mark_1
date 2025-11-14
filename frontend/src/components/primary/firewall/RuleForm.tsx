import React, { useState, useEffect } from 'react';
import { FirewallRule, RuleAction, RuleCondition } from '../../../types/firewall';

interface RuleFormProps {
  rule?: FirewallRule;
  onSubmit: (rule: Partial<FirewallRule>) => void;
  onCancel: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ rule, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<FirewallRule>>({
    name: '',
    description: '',
    action: RuleAction.BLOCK,
    priority: 50,
    enabled: true,
    conditions: []
  });

  const [newCondition, setNewCondition] = useState<RuleCondition>({
    type: 'source_ip',
    operator: 'equals',
    value: ''
  });

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    }
  }, [rule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addCondition = () => {
    if (!newCondition.value.trim()) return;
    
    setFormData({
      ...formData,
      conditions: [...(formData.conditions || []), { ...newCondition }]
    });
    
    setNewCondition({
      type: 'source_ip',
      operator: 'equals',
      value: ''
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions?.filter((_, i) => i !== index) || []
    });
  };

  const conditionTypes = [
    { value: 'source_ip', label: 'Source IP' },
    { value: 'destination_ip', label: 'Destination IP' },
    { value: 'protocol', label: 'Protocol' },
    { value: 'port', label: 'Port' },
    { value: 'user_agent', label: 'User Agent' },
    { value: 'content_type', label: 'Content Type' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'matches', label: 'Matches Regex' },
    { value: 'in_range', label: 'In Range' },
    { value: 'not_equals', label: 'Not Equals' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rule Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter rule name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Higher numbers = higher priority</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter rule description"
        />
      </div>

      {/* Action Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Action
        </label>
        <div className="grid grid-cols-3 gap-4">
          {Object.values(RuleAction).map((action) => (
            <label key={action} className="flex items-center">
              <input
                type="radio"
                name="action"
                value={action}
                checked={formData.action === action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value as RuleAction })}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{action}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Conditions
        </label>
        
        {/* Add Condition */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <select
            value={newCondition.type}
            onChange={(e) => setNewCondition({ ...newCondition, type: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {conditionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={newCondition.operator}
            onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {operators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newCondition.value}
            onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
            placeholder="Value"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            type="button"
            onClick={addCondition}
            className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Add
          </button>
        </div>

        {/* Conditions List */}
        <div className="space-y-2">
          {formData.conditions?.map((condition, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">
                {conditionTypes.find(t => t.value === condition.type)?.label}
              </span>
              <span className="text-sm text-gray-600">
                {operators.find(o => o.value === condition.operator)?.label}
              </span>
              <code className="text-sm bg-white px-2 py-1 rounded border">
                {condition.value}
              </code>
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="ml-auto text-danger-600 hover:text-danger-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {rule ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </form>
  );
};

export default RuleForm;