import React, { useState, useEffect } from 'react';
import { useCryptoStore } from '../../../stores/cryptoStore';
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const SignatureMonitor: React.FC = () => {
  const { signatureStats, fetchSignatureStats } = useCryptoStore();
  const [recentSignatures, setRecentSignatures] = useState<any[]>([]);

  useEffect(() => {
    fetchSignatureStats();
    const interval = setInterval(fetchSignatureStats, 10000);
    return () => clearInterval(interval);
  }, [fetchSignatureStats]);

  useEffect(() => {
    // Simulate recent signatures data
    const mockSignatures = [
      {
        id: 'sig_001',
        timestamp: new Date().toISOString(),
        logHash: 'a1b2c3d4e5f6...',
        device: 'primary_device_001',
        status: 'signed',
        verified: true
      },
      {
        id: 'sig_002',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        logHash: 'b2c3d4e5f6g7...',
        device: 'primary_device_001',
        status: 'signed',
        verified: true
      },
      {
        id: 'sig_003',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        logHash: 'c3d4e5f6g7h8...',
        device: 'primary_device_002',
        status: 'signed',
        verified: true
      }
    ];
    setRecentSignatures(mockSignatures);
  }, []);

  const stats = {
    total: 12458,
    today: 342,
    verified: 12455,
    failed: 3,
    averageTime: '18.7ms'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Signature Monitor</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.total.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Signatures</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">{stats.today}</div>
          <div className="text-sm text-gray-600">Today</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{stats.verified.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signatures */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Signatures</h3>
          <div className="space-y-3">
            {recentSignatures.map((signature) => (
              <div key={signature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {signature.verified ? (
                    <CheckCircleIcon className="h-5 w-5 text-success-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-danger-500" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{signature.id}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(signature.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{signature.device}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">{signature.logHash}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Average Response Time</span>
              <span className="font-semibold text-blue-900">{stats.averageTime}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">Success Rate</span>
              <span className="font-semibold text-green-900">
                {((stats.verified / stats.total) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700">Peak Throughput</span>
              <span className="font-semibold text-purple-900">125 sig/sec</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700">Active TOTP Sessions</span>
              <span className="font-semibold text-yellow-900">3</span>
            </div>
          </div>
        </div>

        {/* Signature Types */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature Types</h3>
          <div className="space-y-3">
            {[
              { type: 'Log Entries', count: 8450, percentage: 68 },
              { type: 'Audit Events', count: 3250, percentage: 26 },
              { type: 'System Alerts', count: 758, percentage: 6 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.type}</span>
                  <span className="font-medium text-gray-900">{item.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification History */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification History</h3>
          <div className="space-y-3">
            {[
              { time: 'Last Hour', verified: 45, failed: 0 },
              { time: 'Last 6 Hours', verified: 280, failed: 1 },
              { time: 'Last 24 Hours', verified: 890, failed: 2 },
              { time: 'Last 7 Days', verified: 6250, failed: 3 }
            ].map((period, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{period.time}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-success-600">{period.verified} verified</span>
                  {period.failed > 0 && (
                    <span className="text-sm text-danger-600">{period.failed} failed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureMonitor;