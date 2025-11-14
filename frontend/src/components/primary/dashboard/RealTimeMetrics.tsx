import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const RealTimeMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock real-time data
    const generateData = () => {
      const now = new Date();
      return {
        time: now.toLocaleTimeString(),
        threats: Math.floor(Math.random() * 10),
        packets: Math.floor(Math.random() * 200) + 50,
        bandwidth: Math.floor(Math.random() * 100) + 20
      };
    };

    // Initial data
    const initialData = Array.from({ length: 10 }, (_, i) => {
      const time = new Date();
      time.setMinutes(time.getMinutes() - (10 - i));
      return {
        time: time.toLocaleTimeString(),
        threats: Math.floor(Math.random() * 10),
        packets: Math.floor(Math.random() * 200) + 50,
        bandwidth: Math.floor(Math.random() * 100) + 20
      };
    });
    setMetrics(initialData);

    // Update every 2 seconds
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newData = [...prev.slice(1), generateData()];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-time Metrics</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="packets"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              name="Packets/Sec"
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.2}
              name="Threats"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <p className="text-2xl font-bold text-primary-600">
            {metrics[metrics.length - 1]?.packets || 0}
          </p>
          <p className="text-xs text-gray-600">Packets/Sec</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-warning-600">
            {metrics[metrics.length - 1]?.threats || 0}
          </p>
          <p className="text-xs text-gray-600">Active Threats</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-success-600">
            {metrics[metrics.length - 1]?.bandwidth || 0} Mbps
          </p>
          <p className="text-xs text-gray-600">Bandwidth</p>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;