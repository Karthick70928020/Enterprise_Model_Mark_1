import React from 'react';
import ThreatMap from '../../components/primary/dashboard/ThreatMap';
import { ThreatReport } from '../../types/api';

const ThreatAnalysisPage: React.FC = () => {
  const mockThreats: ThreatReport[] = [
    {
      threat_id: 'threat_001',
      timestamp: '2024-01-01T10:30:00Z',
      severity: 'high',
      type: 'suspicious_outbound',
      source_ip: '192.168.1.100',
      description: 'Unusual outbound data transfer pattern detected',
      status: 'investigating'
    },
    {
      threat_id: 'threat_002',
      timestamp: '2024-01-01T10:25:00Z',
      severity: 'medium',
      type: 'port_scanning',
      source_ip: '192.168.1.150',
      description: 'Multiple port connection attempts from single source',
      status: 'blocked'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Threat Analysis</h1>
        <p className="text-gray-600">Detailed analysis of security threats and incidents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <ThreatMap threats={mockThreats} />
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Threat Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-600">Threats Today</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-green-600">Auto-Blocked</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents</h2>
          <div className="space-y-3">
            {mockThreats.map((threat) => (
              <div key={threat.threat_id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    threat.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {threat.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{threat.description}</p>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Source: {threat.source_ip}</span>
                  <span>Status: {threat.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysisPage;