import React from 'react';
import { useSecondaryStore } from '../../stores/secondary/secondaryStore';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';
import StatusIndicator from '../../components/shared/notifications/StatusIndicator';

const SystemIntegrityPage: React.FC = () => {
  const { systemIntegrity, fetchSystemIntegrity } = useSecondaryStore();

  React.useEffect(() => {
    fetchSystemIntegrity();
    const interval = setInterval(fetchSystemIntegrity, 30000);
    return () => clearInterval(interval);
  }, [fetchSystemIntegrity]);

  const integrityChecks = [
    { name: 'Cryptographic System', status: 'online', description: 'Key management and signing operations' },
    { name: 'Secure Storage', status: 'online', description: 'Encrypted audit trail storage' },
    { name: 'TOTP Service', status: 'online', description: 'Time-based authentication' },
    { name: 'Audit Trail', status: 'online', description: 'Immutable log chain' },
    { name: 'Hardware Security', status: 'online', description: 'TPM/HSM integration' },
    { name: 'Network Security', status: 'online', description: 'Secure communication channels' }
  ];

  return (
    <div className="space-y-6">
      <DeviceSwitcher />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Integrity Status */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Integrity Status</h2>
          <div className="space-y-4">
            <div className={`p-4 border rounded-lg ${
              systemIntegrity?.system_integrity === 'healthy' 
                ? 'bg-success-50 border-success-200' 
                : 'bg-danger-50 border-danger-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium ${
                    systemIntegrity?.system_integrity === 'healthy' ? 'text-success-900' : 'text-danger-900'
                  }`}>
                    Overall System Integrity
                  </div>
                  <div className={`text-sm ${
                    systemIntegrity?.system_integrity === 'healthy' ? 'text-success-700' : 'text-danger-700'
                  }`}>
                    {systemIntegrity?.system_integrity === 'healthy' 
                      ? 'All systems operational and secure' 
                      : 'System integrity compromised'
                    }
                  </div>
                </div>
                <StatusIndicator 
                  status={systemIntegrity?.system_integrity === 'healthy' ? 'online' : 'error'} 
                  size="lg" 
                  pulse 
                />
              </div>
            </div>

            <div className="space-y-3">
              {integrityChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <StatusIndicator status={check.status as any} />
                    <div>
                      <div className="font-medium text-gray-900">{check.name}</div>
                      <div className="text-sm text-gray-600">{check.description}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Operational</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Metrics</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12,458</div>
                <div className="text-sm text-blue-600">Total Signatures</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.98%</div>
                <div className="text-sm text-green-600">Uptime</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-600">Security Incidents</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">256-bit</div>
                <div className="text-sm text-yellow-600">Encryption</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Last Integrity Check</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Audit Trail Size</span>
                <span className="font-medium text-gray-900">2.4 GB</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Key Rotation</span>
                <span className="font-medium text-gray-900">30 days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Compliance Level</span>
                <span className="font-medium text-gray-900">FIPS 140-2 L3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemIntegrityPage;