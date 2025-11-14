import React, { useState, useEffect } from 'react';
import { useCryptoStore } from '../../../stores/cryptoStore';
import { ClockIcon, KeyIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const TOTPManager: React.FC = () => {
  const { totpStatus, fetchTOTPStatus } = useCryptoStore();
  const [currentCode, setCurrentCode] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(30);

  useEffect(() => {
    fetchTOTPStatus();
    const interval = setInterval(fetchTOTPStatus, 1000);
    return () => clearInterval(interval);
  }, [fetchTOTPStatus]);

  useEffect(() => {
    // Simulate TOTP code generation
    const generateCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setCurrentCode(code);
      setRemainingTime(30);
    };

    generateCode();
    const codeInterval = setInterval(generateCode, 30000);
    const timeInterval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          generateCode();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(codeInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const getTimeColor = (time: number) => {
    if (time > 20) return 'text-success-600';
    if (time > 10) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getTimeBarColor = (time: number) => {
    if (time > 20) return 'bg-success-500';
    if (time > 10) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">TOTP Manager</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current TOTP Code */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current TOTP Code</h3>
          <div className="text-center space-y-4">
            <div className="text-4xl font-mono font-bold text-primary-600 tracking-wider">
              {currentCode}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <span className={`text-lg font-semibold ${getTimeColor(remainingTime)}`}>
                {remainingTime}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getTimeBarColor(remainingTime)}`}
                style={{ width: `${(remainingTime / 30) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              This code refreshes every 30 seconds for enhanced security
            </p>
          </div>
        </div>

        {/* TOTP Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TOTP System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-success-600" />
                <div>
                  <div className="font-medium text-success-900">TOTP Service</div>
                  <div className="text-sm text-success-700">Operational</div>
                </div>
              </div>
              <div className="text-success-600 font-medium">Active</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <KeyIcon className="h-5 w-5 text-primary-600" />
                <div>
                  <div className="font-medium text-primary-900">Key Synchronization</div>
                  <div className="text-sm text-primary-700">Time-synchronized with NTP</div>
                </div>
              </div>
              <div className="text-primary-600 font-medium">Synced</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
                <div>
                  <div className="font-medium text-warning-900">Backup Codes</div>
                  <div className="text-sm text-warning-700">3 backup codes remaining</div>
                </div>
              </div>
              <button className="text-warning-600 hover:text-warning-700 text-sm font-medium">
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Total Authentications</span>
              <span className="font-semibold text-blue-900">12,458</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">Successful Today</span>
              <span className="font-semibold text-green-900">342</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">Failed Attempts</span>
              <span className="font-semibold text-red-900">3</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700">Average Response</span>
              <span className="font-semibold text-purple-900">2.1ms</span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Code Length</div>
                <div className="text-sm text-gray-600">6 digits</div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                Fixed
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Time Step</div>
                <div className="text-sm text-gray-600">30 seconds</div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                Standard
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Hash Algorithm</div>
                <div className="text-sm text-gray-600">SHA-1</div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                Secure
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Grace Period</div>
                <div className="text-sm text-gray-600">±1 time step</div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">
                Enabled
              </span>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              Configure TOTP Settings
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent TOTP Activity</h3>
        <div className="space-y-3">
          {[
            { time: '2 minutes ago', action: 'Signature created', device: 'Primary Device', status: 'success' },
            { time: '5 minutes ago', action: 'Key verification', device: 'Audit System', status: 'success' },
            { time: '12 minutes ago', action: 'Admin login', device: 'Management Console', status: 'success' },
            { time: '18 minutes ago', action: 'Backup code used', device: 'Emergency Access', status: 'warning' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-success-500' : 'bg-warning-500'
                }`} />
                <div>
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.device}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-900">{activity.time}</div>
                <div className={`text-xs ${
                  activity.status === 'success' ? 'text-success-600' : 'text-warning-600'
                }`}>
                  {activity.status === 'success' ? 'Successful' : 'Warning'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TOTPManager;