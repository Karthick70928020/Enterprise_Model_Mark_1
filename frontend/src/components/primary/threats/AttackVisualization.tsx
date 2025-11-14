import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const AttackVisualization: React.FC = () => {
  // Mock data for attack visualization
  const attackData = [
    { hour: '00:00', attacks: 12, blocked: 10, severity: 2 },
    { hour: '02:00', attacks: 8, blocked: 7, severity: 1 },
    { hour: '04:00', attacks: 5, blocked: 5, severity: 1 },
    { hour: '06:00', attacks: 15, blocked: 12, severity: 3 },
    { hour: '08:00', attacks: 25, blocked: 22, severity: 4 },
    { hour: '10:00', attacks: 32, blocked: 30, severity: 5 },
    { hour: '12:00', attacks: 28, blocked: 25, severity: 4 },
    { hour: '14:00', attacks: 35, blocked: 32, severity: 5 },
    { hour: '16:00', attacks: 22, blocked: 20, severity: 3 },
    { hour: '18:00', attacks: 18, blocked: 16, severity: 2 },
    { hour: '20:00', attacks: 14, blocked: 13, severity: 2 },
    { hour: '22:00', attacks: 9, blocked: 8, severity: 1 },
  ];

  const attackTypes = [
    { type: 'Port Scanning', count: 45, color: '#3b82f6' },
    { type: 'Brute Force', count: 32, color: '#ef4444' },
    { type: 'DDoS', count: 18, color: '#f59e0b' },
    { type: 'Malware', count: 12, color: '#10b981' },
    { type: 'Phishing', count: 8, color: '#8b5cf6' },
  ];

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return '#ef4444';
    if (severity >= 3) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="space-y-6">
      {/* Attack Timeline */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attack Timeline (24h)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={attackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attacks" name="Total Attacks" fill="#3b82f6" opacity={0.8} />
              <Bar dataKey="blocked" name="Blocked Attacks" fill="#10b981" opacity={0.8} />
              <Line 
                type="monotone" 
                dataKey="severity" 
                name="Severity Level" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attack Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attack Types</h2>
          <div className="space-y-3">
            {attackTypes.map((attack) => (
              <div key={attack.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: attack.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{attack.type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(attack.count / 115) * 100}%`,
                        backgroundColor: attack.color
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {attack.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Countries */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Source Countries</h2>
          <div className="space-y-3">
            {[
              { country: 'United States', attacks: 38, flag: '🇺🇸' },
              { country: 'China', attacks: 29, flag: '🇨🇳' },
              { country: 'Russia', attacks: 22, flag: '🇷🇺' },
              { country: 'Germany', attacks: 15, flag: '🇩🇪' },
              { country: 'Brazil', attacks: 11, flag: '🇧🇷' },
            ].map((source) => (
              <div key={source.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{source.flag}</span>
                  <span className="text-sm font-medium text-gray-700">{source.country}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{source.attacks} attacks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">98.7%</div>
          <div className="text-sm text-gray-600">Block Rate</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">18.7ms</div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">0</div>
          <div className="text-sm text-gray-600">Successful Breaches</div>
        </div>
      </div>
    </div>
  );
};

export default AttackVisualization;