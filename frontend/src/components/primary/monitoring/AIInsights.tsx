import React from 'react';
import { LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const AIInsights: React.FC = () => {
  const insights = [
    {
      id: 1,
      type: 'anomaly',
      title: 'Unusual Outbound Traffic',
      description: 'Detected abnormal data transfer patterns to external IPs',
      confidence: 0.92,
      severity: 'high',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'pattern',
      title: 'Port Scanning Activity',
      description: 'Multiple sequential port connections from single source',
      confidence: 0.87,
      severity: 'medium',
      timestamp: '5 minutes ago'
    },
    {
      id: 3,
      type: 'behavior',
      title: 'Suspicious Login Patterns',
      description: 'Multiple failed login attempts followed by success',
      confidence: 0.78,
      severity: 'medium',
      timestamp: '10 minutes ago'
    }
  ];

  const modelStats = {
    autoencoder: { accuracy: 0.956, status: 'active' },
    isolation_forest: { accuracy: 0.923, status: 'active' },
    threat_classifier: { accuracy: 0.891, status: 'active' }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-danger-600 bg-danger-50';
      case 'medium': return 'text-warning-600 bg-warning-50';
      case 'low': return 'text-success-600 bg-success-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h2>
      
      {/* Model Status */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Model Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(modelStats).map(([model, stats]) => (
            <div key={model} className="text-center">
              <div className="bg-primary-50 rounded-lg p-3">
                <ChartBarIcon className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 capitalize">{model.replace('_', ' ')}</p>
                <p className="text-lg font-bold text-primary-600">
                  {(stats.accuracy * 100).toFixed(1)}%
                </p>
                <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                  stats.status === 'active' 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-danger-100 text-danger-800'
                }`}>
                  {stats.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Recent Insights</h3>
        {insights.map((insight) => (
          <div key={insight.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
            <LightBulbIcon className="h-5 w-5 text-warning-500 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(insight.severity)}`}>
                  {(insight.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              <p className="text-xs text-gray-500 mt-1">{insight.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-primary-50 rounded-lg">
        <p className="text-sm text-primary-700">
          <strong>AI Analysis:</strong> Processing ~1,200 events/sec with 94.3% accuracy across all models.
        </p>
      </div>
    </div>
  );
};

export default AIInsights;