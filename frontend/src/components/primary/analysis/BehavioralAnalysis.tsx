import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { useThreatStore } from '../../../stores/threatStore';

const BehavioralAnalysis: React.FC = () => {
  const { behavioralData, fetchBehavioralData } = useThreatStore();
  const [selectedUser, setSelectedUser] = useState<string>('all');

  useEffect(() => {
    fetchBehavioralData();
    const interval = setInterval(fetchBehavioralData, 10000);
    return () => clearInterval(interval);
  }, [fetchBehavioralData]);

  const anomalyScores = [
    { user: 'user1', score: 0.1, activity: 45, risk: 'low' },
    { user: 'user2', score: 0.3, activity: 78, risk: 'low' },
    { user: 'user3', score: 0.7, activity: 120, risk: 'medium' },
    { user: 'user4', score: 0.9, activity: 200, risk: 'high' },
    { user: 'user5', score: 0.2, activity: 65, risk: 'low' }
  ];

  const activityPatterns = [
    { hour: '00:00', normal: 120, current: 115 },
    { hour: '04:00', normal: 80, current: 75 },
    { hour: '08:00', normal: 450, current: 420 },
    { hour: '12:00', normal: 520, current: 780 },
    { hour: '16:00', normal: 480, current: 460 },
    { hour: '20:00', normal: 320, current: 310 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Behavioral Analysis</h2>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Users</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
          <option value="user3">User 3</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Detection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomaly Detection Scores</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={anomalyScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" name="Activity" />
                <YAxis dataKey="score" name="Anomaly Score" />
                <ZAxis dataKey="risk" name="Risk" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Users" data={anomalyScores} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Patterns */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Patterns</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="normal" fill="#3b82f6" name="Normal Pattern" />
                <Bar dataKey="current" fill="#ef4444" name="Current Activity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            {anomalyScores.map((user) => (
              <div key={user.user} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    user.risk === 'high' ? 'bg-danger-500' :
                    user.risk === 'medium' ? 'bg-warning-500' : 'bg-success-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{user.user}</div>
                    <div className="text-sm text-gray-600">Score: {user.score}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{user.activity}</div>
                  <div className="text-sm text-gray-600">activities</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Average Session Duration</span>
              <span className="font-semibold text-blue-900">45m</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">Access Frequency</span>
              <span className="font-semibold text-green-900">12/day</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700">Geographic Spread</span>
              <span className="font-semibold text-yellow-900">3 locations</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">Anomaly Rate</span>
              <span className="font-semibold text-red-900">2.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralAnalysis;