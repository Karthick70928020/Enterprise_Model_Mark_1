import React from 'react';
import { NetworkStats } from '../../../types/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrafficOverviewProps {
  stats: NetworkStats | null;
}

const TrafficOverview: React.FC<TrafficOverviewProps> = ({ stats }) => {
  // Mock data for demonstration
  const trafficData = [
    { time: '10:00', packets: 120, threats: 2 },
    { time: '10:05', packets: 180, threats: 1 },
    { time: '10:10', packets: 150, threats: 3 },
    { time: '10:15', packets: 220, threats: 5 },
    { time: '10:20', packets: 190, threats: 2 },
    { time: '10:25', packets: 210, threats: 4 },
    { time: '10:30', packets: 240, threats: 3 },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Network Traffic Overview</h2>
      
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{stats.packets_per_second}</p>
            <p className="text-sm text-gray-600">Packets/Sec</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-600">{stats.active_threats}</p>
            <p className="text-sm text-gray-600">Active Threats</p>
          </div>
        </div>
      )}

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="packets"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Packets/Sec"
            />
            <Line
              type="monotone"
              dataKey="threats"
              stroke="#ef4444"
              strokeWidth={2}
              name="Threats"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficOverview;