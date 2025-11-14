import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TimelineChartProps {
  data: any[];
  dataKey: string;
  height?: number;
  color?: string;
  showThreshold?: boolean;
  thresholdValue?: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  dataKey,
  height = 200,
  color = '#3b82f6',
  showThreshold = false,
  thresholdValue = 0
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="timestamp" 
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip 
          labelFormatter={(value) => new Date(value).toLocaleString()}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        {showThreshold && (
          <ReferenceLine 
            y={thresholdValue} 
            stroke="#ef4444" 
            strokeDasharray="3 3" 
            label="Threshold" 
          />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;