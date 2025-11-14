import React, { useEffect } from 'react';
import { usePrimaryStore } from '../../../stores/primary/primaryStore';
import TrafficOverview from './TrafficOverview';
import ThreatMap from './ThreatMap';
import SystemHealth from './SystemHealth';
import RealTimeMetrics from './RealTimeMetrics';
import { RefreshIcon } from '@heroicons/react/24/outline';

const PrimaryDashboard: React.FC = () => {
  const {
    systemStatus,
    networkStats,
    currentThreats,
    loading,
    fetchSystemStatus,
    fetchNetworkStats,
    fetchCurrentThreats,
  } = usePrimaryStore();

  useEffect(() => {
    fetchSystemStatus();
    fetchNetworkStats();
    fetchCurrentThreats();

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchSystemStatus();
      fetchNetworkStats();
      fetchCurrentThreats();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchSystemStatus, fetchNetworkStats, fetchCurrentThreats]);

  const handleRefresh = () => {
    fetchSystemStatus();
    fetchNetworkStats();
    fetchCurrentThreats();
  };

  if (loading && !systemStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading primary device data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Primary Device</h1>
          <p className="text-gray-600">AI Security Engine - Real-time Threat Detection</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 btn-primary"
        >
          <RefreshIcon className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* System Status */}
      {systemStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">System Status</h3>
            <div className="mt-2 flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  systemStatus.status === 'operational' ? 'bg-success-500' : 'bg-danger-500'
                }`}
              />
              <p className="text-2xl font-semibold text-gray-900 capitalize">
                {systemStatus.status}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Threat Level</h3>
            <p className={`mt-2 text-2xl font-semibold capitalize ${
              systemStatus.threat_level === 'high' || systemStatus.threat_level === 'critical'
                ? 'text-danger-600'
                : systemStatus.threat_level === 'medium'
                ? 'text-warning-600'
                : 'text-success-600'
            }`}>
              {systemStatus.threat_level}
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Active Connections</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {systemStatus.active_connections}
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Blocked Threats</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {systemStatus.blocked_threats}
            </p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <TrafficOverview stats={networkStats} />
          <ThreatMap threats={currentThreats} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SystemHealth status={systemStatus} />
          <RealTimeMetrics />
        </div>
      </div>
    </div>
  );
};

export default PrimaryDashboard; 