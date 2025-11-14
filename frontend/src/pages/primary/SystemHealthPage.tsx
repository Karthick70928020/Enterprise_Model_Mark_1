import React from 'react';
import { usePrimaryStore } from '../../stores/primary/primaryStore';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';
import StatusIndicator from '../../components/shared/notifications/StatusIndicator';

const SystemHealthPage: React.FC = () => {
  const { systemStatus, fetchSystemStatus } = usePrimaryStore();

  React.useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchSystemStatus]);

  const healthMetrics = [
    { name: 'CPU Usage', value: '15%', status: 'online' },
    { name: 'Memory Usage', value: '62%', status: 'warning' },
    { name: 'Disk Space', value: '45%', status: 'online' },
    { name: 'Network I/O', value: '1.2 Gbps', status: 'online' },
    { name: 'Active Connections', value: '1,245', status: 'online' },
    { name: 'Threat Detection', value: 'Active', status: 'online' }
  ];

  return (
    <div className="space-y-6">
      <DeviceSwitcher />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg">
              <div>
                <div className="font-medium text-success-900">Primary Device</div>
                <div className="text-sm text-success-700">AI Security Engine</div>
              </div>
              <StatusIndicator status="online" size="lg" pulse />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    <StatusIndicator status={metric.status as any} size="sm" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Status</h2>
          <div className="space-y-3">
            {[
              { service: 'Network Monitoring', status: 'online', uptime: '99.8%' },
              { service: 'Threat Detection', status: 'online', uptime: '99.9%' },
              { service: 'Firewall Engine', status: 'online', uptime: '100%' },
              { service: 'Log Processing', status: 'online', uptime: '99.7%' },
              { service: 'AI Models', status: 'online', uptime: '99.5%' },
              { service: 'API Gateway', status: 'online', uptime: '99.9%' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <StatusIndicator status={service.status as any} />
                  <div>
                    <div className="font-medium text-gray-900">{service.service}</div>
                    <div className="text-sm text-gray-600">Uptime: {service.uptime}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;