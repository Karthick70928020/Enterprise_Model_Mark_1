import React, { useState, useEffect } from 'react';
import { useThreatStore } from '../../../stores/threatStore';

const PatternRecognition: React.FC = () => {
  const { patterns, fetchPatterns } = useThreatStore();
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  useEffect(() => {
    fetchPatterns();
    const interval = setInterval(fetchPatterns, 15000);
    return () => clearInterval(interval);
  }, [fetchPatterns]);

  const detectedPatterns = [
    {
      id: '1',
      name: 'Port Scanning',
      confidence: 0.94,
      severity: 'high',
      description: 'Sequential port access patterns detected',
      occurrences: 23,
      firstSeen: '2024-01-01T08:00:00Z',
      lastSeen: '2024-01-01T14:30:00Z'
    },
    {
      id: '2',
      name: 'Data Exfiltration',
      confidence: 0.87,
      severity: 'critical',
      description: 'Large outbound data transfers during off-hours',
      occurrences: 8,
      firstSeen: '2024-01-01T20:15:00Z',
      lastSeen: '2024-01-01T23:45:00Z'
    },
    {
      id: '3',
      name: 'Brute Force Attempt',
      confidence: 0.92,
      severity: 'high',
      description: 'Rapid sequential login attempts from single source',
      occurrences: 15,
      firstSeen: '2024-01-01T11:20:00Z',
      lastSeen: '2024-01-01T11:25:00Z'
    },
    {
      id: '4',
      name: 'DNS Tunneling',
      confidence: 0.76,
      severity: 'medium',
      description: 'Unusual DNS query patterns and payload sizes',
      occurrences: 5,
      firstSeen: '2024-01-01T09:45:00Z',
      lastSeen: '2024-01-01T13:20:00Z'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'high': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'medium': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'low': return 'bg-success-100 text-success-800 border-success-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-danger-600';
    if (confidence >= 0.8) return 'text-warning-600';
    if (confidence >= 0.7) return 'text-primary-600';
    return 'text-success-600';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Pattern Recognition</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detected Patterns */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Threat Patterns</h3>
          <div className="space-y-4">
            {detectedPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedPattern === pattern.id ? 'ring-2 ring-primary-500' : ''
                } ${getSeverityColor(pattern.severity)}`}
                onClick={() => setSelectedPattern(pattern.id === selectedPattern ? null : pattern.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getConfidenceColor(pattern.confidence)}`}>
                      {(pattern.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full capitalize">
                      {pattern.severity}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{pattern.occurrences} occurrences</span>
                  <span>Last: {new Date(pattern.lastSeen).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Details & Statistics */}
        <div className="space-y-6">
          {/* Selected Pattern Details */}
          {selectedPattern && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pattern Details</h3>
              {(() => {
                const pattern = detectedPatterns.find(p => p.id === selectedPattern);
                if (!pattern) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Confidence Score</label>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-primary-600"
                              style={{ width: `${pattern.confidence * 100}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {(pattern.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Severity</label>
                        <div className={`mt-1 px-3 py-2 rounded text-center font-medium capitalize ${getSeverityColor(pattern.severity)}`}>
                          {pattern.severity}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Timeline</label>
                      <div className="mt-1 text-sm text-gray-600 space-y-1">
                        <div>First Detected: {new Date(pattern.firstSeen).toLocaleString()}</div>
                        <div>Last Detected: {new Date(pattern.lastSeen).toLocaleString()}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Recommended Actions</label>
                      <div className="mt-1 space-y-2">
                        <button className="w-full text-left px-3 py-2 bg-danger-50 text-danger-700 rounded text-sm">
                          Block Source IPs
                        </button>
                        <button className="w-full text-left px-3 py-2 bg-warning-50 text-warning-700 rounded text-sm">
                          Increase Monitoring
                        </button>
                        <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded text-sm">
                          Update Detection Rules
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Pattern Statistics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pattern Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">Total Patterns Detected</span>
                <span className="font-semibold text-blue-900">{detectedPatterns.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">High Confidence Patterns</span>
                <span className="font-semibold text-green-900">
                  {detectedPatterns.filter(p => p.confidence >= 0.8).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-700">Active Investigations</span>
                <span className="font-semibold text-yellow-900">3</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">Critical Severity</span>
                <span className="font-semibold text-red-900">
                  {detectedPatterns.filter(p => p.severity === 'critical').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternRecognition;