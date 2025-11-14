import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Bar } from 'recharts';

interface NetworkGraphProps {
  data: any[];
  type?: 'line' | 'area' | 'bar';
  height?: number;
  dataKeys: string[];
  colors?: string[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  data,
  type = 'line',
  height = 300,
  dataKeys,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
}) => {
  const renderChart = () => {
    switch (type) {
      case 'area':
        return dataKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.3}
          />
        ));
      case 'bar':
        return dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
          />
        ));
      default:
        return dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
          />
        ));
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="time" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        {renderChart()}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NetworkGraph;