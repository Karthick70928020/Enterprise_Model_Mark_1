import React, { useState, useEffect } from 'react';
import { usePrimaryStore } from '../../../stores/primary/primaryStore';
import { ThreatReport } from '../../../types/api';

const IncidentTimeline: React.FC = () => {
  const { currentThreats } = usePrimaryStore();
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    // Process threats for timeline display
    const processedData = currentThreats
      .slice(0, 20)
      .map((threat: ThreatReport, index: number) => ({
        id: threat.threat_id,
        timestamp: new Date(threat.timestamp),
        severity: threat.severity,
        type: threat.type,
        description: threat.description,
        position: index % 2 === 0 ? 'left' : 'right'
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setTimelineData(processedData);
  }, [currentThreats]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-500';
      case 'high': return 'bg-warning-500';
      case 'medium': return 'bg-warning-400';
      case 'low': return 'bg-success-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-danger-200';
      case 'high': return 'border-warning-200';
      case 'medium': return 'border-warning-200';
      case 'low': return 'border-success-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Incident Timeline</h2>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>

        {timelineData.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">No incidents to display</div>
          </div>
        ) : (
          <div className="space-y-8">
            {timelineData.map((incident) => (
              <div
                key={incident.id}
                className={`flex items-center ${
                  incident.position === 'left' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Timeline point */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-4 border-gray-300 relative z-10"></div>

                {/* Content */}
                <div className={`flex-1 ${
                  incident.position === 'left' ? 'pr-8' : 'pl-8'
                }`}>
                  <div className={`p-4 rounded-lg border ${
                    getSeverityBorder(incident.severity)
                  } bg-white shadow-sm`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)}`}></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {incident.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        incident.severity === 'critical' || incident.severity === 'high'
                          ? 'bg-danger-100 text-danger-800'
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                    <p className="text-xs text-gray-500">
                      {incident.timestamp.toLocaleTimeString()} • {incident.timestamp.toLocaleDateString()}
                    </p>
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

export default IncidentTimeline;