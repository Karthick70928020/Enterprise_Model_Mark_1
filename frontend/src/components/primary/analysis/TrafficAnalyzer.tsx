import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNetworkStore } from '../../../stores/networkStore';

const TrafficAnalyzer: React.FC = () => {
  const { trafficData, loading, fetchTrafficData } = useNetworkStore();
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h');

  useEffect(() => {
    fetchTrafficData(timeRange);
    const interval = setInterval(() => fetchTrafficData(timeRange), 5000);
    return () => clearInterval(interval);
  }, [timeRange, fetchTrafficData]);

  const protocolDistribution = [
    { name: 'HTTP', value: 45, color: '#3b82f6' },
    { name: 'HTTPS', value: 35, color: '#10b981' },
    { name: 'DNS', value: 8, color: '#f59e0b' },
    { name: 'SSH', value: 5, color: '#ef4444' },
    { name: 'Other', value: 7, color: '#6b7280' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Traffic Analysis</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="1h">Last 1 Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h">Last 24 Hours</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Volume Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Traffic Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="packets" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Distribution</h3>
          <div className="space-y-3">
            {protocolDistribution.map((protocol) => (
              <div key={protocol.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: protocol.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{protocol.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${protocol.value}%`, backgroundColor: protocol.color }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{protocol.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Talkers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Talkers</h3>
          <div className="space-y-3">
            {[
              { ip: '192.168.1.100', packets: 12500, threats: 3 },
              { ip: '192.168.1.101', packets: 9800, threats: 1 },
              { ip: '192.168.1.102', packets: 7600, threats: 0 },
              { ip: '10.0.0.50', packets: 5200, threats: 2 },
              { ip: '192.168.1.103', packets: 4100, threats: 0 }
            ].map((talker, index) => (
              <div key={talker.ip} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{talker.ip}</div>
                    <div className="text-sm text-gray-600">{talker.packets.toLocaleString()} packets</div>
                  </div>
                </div>
                {talker.threats > 0 && (
                  <div className="px-2 py-1 bg-danger-100 text-danger-800 text-xs font-medium rounded-full">
                    {talker.threats} threats
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12.5K</div>
              <div className="text-sm text-blue-600">Packets/Min</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">45.2</div>
              <div className="text-sm text-green-600">Mbps</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">23</div>
              <div className="text-sm text-red-600">Threats/Min</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">98.2%</div>
              <div className="text-sm text-purple-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalyzer;