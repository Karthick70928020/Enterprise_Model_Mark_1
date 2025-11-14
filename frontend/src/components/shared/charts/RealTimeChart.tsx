import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RealTimeChartProps {
  data: any[];
  dataKey: string;
  color?: string;
  title?: string;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({
  data,
  dataKey,
  color = '#3b82f6',
  title
}) => {
  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealTimeChart;