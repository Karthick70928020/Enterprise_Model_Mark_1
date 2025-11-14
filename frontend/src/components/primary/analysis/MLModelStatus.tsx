import React, { useState, useEffect } from 'react';
import { usePrimaryStore } from '../../../stores/primary/primaryStore';

const MLModelStatus: React.FC = () => {
  const { aiModelsStatus, fetchAIModelsStatus } = usePrimaryStore();
  const [selectedModel, setSelectedModel] = useState<'autoencoder' | 'isolation_forest'>('autoencoder');

  useEffect(() => {
    fetchAIModelsStatus();
    const interval = setInterval(fetchAIModelsStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchAIModelsStatus]);

  const modelData = {
    autoencoder: {
      name: 'Autoencoder',
      description: 'Unsupervised anomaly detection using neural networks',
      status: 'active',
      accuracy: 0.956,
      precision: 0.923,
      recall: 0.891,
      lastTraining: '2024-01-01T08:00:00Z',
      trainingSamples: 125000,
      features: ['packet_size', 'protocol', 'frequency', 'timing']
    },
    isolation_forest: {
      name: 'Isolation Forest',
      description: 'Ensemble method for outlier detection',
      status: 'active',
      accuracy: 0.912,
      precision: 0.884,
      recall: 0.867,
      lastTraining: '2024-01-01T08:00:00Z',
      trainingSamples: 125000,
      features: ['connection_duration', 'data_volume', 'port_sequence', 'geo_distance']
    }
  };

  const trainingHistory = [
    { date: '2024-01-01', accuracy: 0.94, loss: 0.15 },
    { date: '2023-12-25', accuracy: 0.92, loss: 0.18 },
    { date: '2023-12-18', accuracy: 0.89, loss: 0.22 },
    { date: '2023-12-11', accuracy: 0.87, loss: 0.25 },
    { date: '2023-12-04', accuracy: 0.85, loss: 0.28 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'training': return 'bg-warning-100 text-warning-800';
      case 'error': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">ML Model Status</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Selection & Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Overview</h3>
          <div className="space-y-4">
            {(['autoencoder', 'isolation_forest'] as const).map((modelKey) => {
              const model = modelData[modelKey];
              return (
                <div
                  key={modelKey}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedModel === modelKey
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedModel(modelKey)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{model.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(model.status)}`}>
                      {model.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Accuracy: {(model.accuracy * 100).toFixed(1)}%</span>
                    <span>Precision: {(model.precision * 100).toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Model Details */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {modelData[selectedModel].name} - Detailed Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-medium text-gray-900">
                      {(modelData[selectedModel].accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-success-500"
                      style={{ width: `${modelData[selectedModel].accuracy * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Precision</span>
                    <span className="font-medium text-gray-900">
                      {(modelData[selectedModel].precision * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: `${modelData[selectedModel].precision * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Recall</span>
                    <span className="font-medium text-gray-900">
                      {(modelData[selectedModel].recall * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-warning-500"
                      style={{ width: `${modelData[selectedModel].recall * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Model Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Model Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Training</span>
                  <span className="font-medium text-gray-900">
                    {new Date(modelData[selectedModel].lastTraining).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Training Samples</span>
                  <span className="font-medium text-gray-900">
                    {modelData[selectedModel].trainingSamples.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Features</span>
                  <span className="font-medium text-gray-900">
                    {modelData[selectedModel].features.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">18.7ms</span>
                </div>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3">Feature Importance</h4>
              <div className="space-y-2">
                {modelData[selectedModel].features.map((feature, index) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <div className="w-24 text-sm text-gray-600 truncate">{feature}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary-500"
                        style={{ width: `${90 - index * 10}%` }}
                      />
                    </div>
                    <div className="w-8 text-right text-sm text-gray-600">
                      {90 - index * 10}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training History */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Training History</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loss</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trainingHistory.map((training, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{training.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{(training.accuracy * 100).toFixed(1)}%</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{training.loss.toFixed(3)}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLModelStatus;