import React, { useEffect, useState } from 'react';
import { usePrimaryStore } from '../../../stores/primary/primaryStore';
import { ThreatReport } from '../../../types/api';
import ThreatGauge from '../../shared/charts/ThreatGauge';
import { ShieldExclamationIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ThreatDashboard: React.FC = () => {
  const { currentThreats, fetchCurrentThreats, loading } = usePrimaryStore();
  const [threatStats, setThreatStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  useEffect(() => {
    fetchCurrentThreats();
    const interval = setInterval(fetchCurrentThreats, 10000);
    return () => clearInterval(interval);
  }, [fetchCurrentThreats]);

  useEffect(() => {
    // Calculate threat statistics
    const stats = {
      critical: currentThreats.filter(t => t.severity === 'critical').length,
      high: currentThreats.filter(t => t.severity === 'high').length,
      medium: currentThreats.filter(t => t.severity === 'medium').length,
      low: currentThreats.filter(t => t.severity === 'low').length
    };
    setThreatStats(stats);
  }, [currentThreats]);

  const totalThreats = currentThreats.length;
  const activeCritical = threatStats.critical + threatStats.high;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Threat Dashboard</h1>
          <p className="text-gray-600">Real-time threat monitoring and analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            activeCritical > 0 ? 'bg-danger-100 text-danger-800' : 'bg-success-100 text-success-800'
          }`}>
            {activeCritical} Active Critical Threats
          </div>
        </div>
      </div>

      {/* Threat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Threats</p>
              <p className="text-2xl font-bold text-gray-900">{totalThreats}</p>
            </div>
            <ShieldExclamationIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-danger-600">{threatStats.critical}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-danger-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High</p>
              <p className="text-2xl font-bold text-warning-600">{threatStats.high}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-warning-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blocked Today</p>
              <p className="text-2xl font-bold text-success-600">24</p>
            </div>
            <ShieldExclamationIcon className="h-8 w-8 text-success-400" />
          </div>
        </div>
      </div>

      {/* Threat Gauge and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Level Gauge */}
        <div className="card lg:col-span-1 flex flex-col items-center justify-center">
          <ThreatGauge 
            value={activeCritical * 10} 
            label="Current Threat Level"
            size="lg"
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {activeCritical > 0 ? 'Elevated Threat Level' : 'Normal Operations'}
            </p>
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Threat Distribution</h2>
          <div className="space-y-4">
            {[
              { level: 'critical', count: threatStats.critical, color: 'bg-danger-500' },
              { level: 'high', count: threatStats.high, color: 'bg-warning-500' },
              { level: 'medium', count: threatStats.medium, color: 'bg-warning-400' },
              { level: 'low', count: threatStats.low, color: 'bg-success-500' }
            ].map((item) => (
              <div key={item.level} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.level}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ 
                        width: `${totalThreats > 0 ? (item.count / totalThreats) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Threats</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading threats...</div>
          </div>
        ) : currentThreats.length === 0 ? (
          <div className="text-center py-8">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No threats detected</h3>
            <p className="mt-1 text-sm text-gray-500">All systems are secure.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentThreats.slice(0, 10).map((threat: ThreatReport) => (
              <div
                key={threat.threat_id}
                className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                  threat.severity === 'critical' ? 'bg-danger-50 border-danger-500' :
                  threat.severity === 'high' ? 'bg-warning-50 border-warning-500' :
                  threat.severity === 'medium' ? 'bg-warning-50 border-warning-400' :
                  'bg-success-50 border-success-500'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      threat.severity === 'critical' ? 'bg-danger-500' :
                      threat.severity === 'high' ? 'bg-warning-500' :
                      threat.severity === 'medium' ? 'bg-warning-400' :
                      'bg-success-500'
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {threat.type.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600">{threat.description}</p>
                      {threat.source_ip && (
                        <p className="text-xs text-gray-500 mt-1">
                          Source: {threat.source_ip}
                        </p>
                      )}
                    </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatDashboard;