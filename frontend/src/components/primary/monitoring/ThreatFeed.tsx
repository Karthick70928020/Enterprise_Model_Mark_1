import React from 'react';
import { ThreatReport } from '../../../types/api';
import { ShieldExclamationIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ThreatFeedProps {
  threats: ThreatReport[];
}

const ThreatFeed: React.FC<ThreatFeedProps> = ({ threats }) => {
  const getSeverityIcon = (severity: string) => {
    const baseClasses = "h-5 w-5";
    switch (severity) {
      case 'critical':
        return <ShieldExclamationIcon className={`${baseClasses} text-danger-500`} />;
      case 'high':
        return <ShieldExclamationIcon className={`${baseClasses} text-warning-500`} />;
      case 'medium':
        return <ShieldExclamationIcon className={`${baseClasses} text-warning-400`} />;
      default:
        return <ShieldExclamationIcon className={`${baseClasses} text-success-500`} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-50 border-danger-200';
      case 'high': return 'bg-warning-50 border-warning-200';
      case 'medium': return 'bg-warning-50 border-warning-100';
      case 'low': return 'bg-success-50 border-success-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Threat Feed</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ClockIcon className="h-4 w-4" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {threats.map((threat) => (
          <div
            key={threat.threat_id}
            className={`p-4 border rounded-lg ${getSeverityColor(threat.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(threat.severity)}
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {threat.type.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{threat.description}</p>
                  {threat.source_ip && (
                    <p className="text-xs text-gray-500 mt-1">
                      Source: {threat.source_ip}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  threat.severity === 'critical' || threat.severity === 'high'
                    ? 'bg-danger-100 text-danger-800'
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {threat.severity}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(threat.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {threats.length === 0 && (
          <div className="text-center py-8">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No threats detected</h3>
            <p className="mt-1 text-sm text-gray-500">All systems are secure.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatFeed;