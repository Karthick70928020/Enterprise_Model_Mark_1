import React from 'react';
import TrafficAnalyzer from '../../components/primary/analysis/TrafficAnalyzer';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';

const NetworkMonitorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <DeviceSwitcher />
      <TrafficAnalyzer />
    </div>
  );
};

export default NetworkMonitorPage;