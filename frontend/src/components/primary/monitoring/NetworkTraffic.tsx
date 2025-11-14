import React from 'react';

const NetworkTraffic: React.FC = () => {
  const trafficData = [
    { protocol: 'HTTP', percentage: 45, color: 'bg-primary-500' },
    { protocol: 'HTTPS', percentage: 30, color: 'bg-success-500' },
    { protocol: 'SSH', percentage: 10, color: 'bg-warning-500' },
    { protocol: 'DNS', percentage: 8, color: 'bg-info-500' },
    { protocol: 'Other', percentage: 7, color: 'bg-gray-500' }
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Traffic by Protocol</h2>
      
      <div className="space-y-3">
        {trafficData.map((item) => (
          <div key={item.protocol} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 w-20">{item.protocol}</span>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">{item.percentage}%</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <h3 className="font-medium text-primary-900 mb-2">Traffic Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-primary-700">Total Packets:</span>
            <span className="text-primary-900 ml-2">12,458</span>
          </div>
          <div>
            <span className="text-primary-700">Encrypted:</span>
            <span className="text-primary-900 ml-2">78%</span>
          </div>
          <div>
            <span className="text-primary-700">Suspicious:</span>
            <span className="text-primary-900 ml-2">2.3%</span>
          </div>
          <div>
            <span className="text-primary-700">Blocked:</span>
            <span className="text-primary-900 ml-2">145</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTraffic;