import React from 'react';

interface ThreatGaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ThreatGauge: React.FC<ThreatGaugeProps> = ({
  value,
  max = 100,
  label = 'Threat Level',
  size = 'md'
}) => {
  const percentage = (value / max) * 100;
  
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const getThreatColor = (percent: number) => {
    if (percent >= 80) return '#dc2626'; // red-600
    if (percent >= 60) return '#ea580c'; // orange-600
    if (percent >= 40) return '#d97706'; // amber-600
    if (percent >= 20) return '#65a30d'; // lime-600
    return '#16a34a'; // green-600
  };

  const strokeColor = getThreatColor(percentage);
  const circumference = 2 * Math.PI * 45; // radius 45

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-600">Level</div>
          </div>
        </div>
      </div>
      {label && (
        <div className="mt-2 text-sm font-medium text-gray-700">{label}</div>
      )}
    </div>
  );
};

export default ThreatGauge;