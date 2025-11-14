import React from 'react';
import { ThreatReport } from '../../../types/api';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface ThreatMapProps {
  threats: ThreatReport[];
}

const ThreatMap: React.FC<ThreatMapProps> = ({ threats }) => {
  const getThreatColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-danger-500';
      case 'high':
        return 'bg-warning-500';
      case 'medium':
        return 'bg-warning-400';
      case 'low':
        return 'bg-success-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getThreatBorder = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'threat-critical';
      case 'high':
        return 'threat-high';
      case 'medium':
        return 'threat-medium';
      case 'low':
        return 'threat-low';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Active Threats</h2>
        <div className="flex items-center space-x-2">
          <ShieldExclamationIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">{threats.length} active</span>
        </div>
      </div>

      <div className="space-y-3">
        {threats.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-success-500 text-lg font-semibold">No Active Threats</div>
            <p className="text-gray-600 mt-1">All systems are secure</p>
          </div>
        ) : (
          threats.map((threat) => (
            <div
              key={threat.threat_id}
              className={`p-4 rounded-lg ${getThreatBorder(threat.severity)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getThreatColor(threat.severity)}`}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {threat.type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600">{threat.description}</p>
                    {threat.source_ip && (
                      <p className="text-xs text-gray-500">From: {threat.source_ip}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium capitalize ${
                      threat.severity === 'critical' || threat.severity === 'high'
                        ? 'text-danger-600'
                        : 'text-warning-600'
                    }`}
                  >
                    {threat.severity}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThreatMap;