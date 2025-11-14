import React from 'react';
import { useAuthStore } from '../../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Logins', value: '1,247' },
    { label: 'Last Login', value: '2 hours ago' },
    { label: 'Session Duration', value: '45 minutes' },
    { label: 'Alerts Generated', value: '89' }
  ];

  const activities = [
    { action: 'Logged in', time: '2 hours ago', device: 'Chrome on Windows' },
    { action: 'Viewed firewall rules', time: '3 hours ago', device: 'Chrome on Windows' },
    { action: 'Generated report', time: '5 hours ago', device: 'Chrome on Windows' },
    { action: 'Updated policy', time: '1 day ago', device: 'Safari on macOS' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account information and view activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.username}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  defaultValue="John"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="btn-primary">
                Save Changes
              </button>
              <button className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{stat.label}</span>
                  <span className="font-semibold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 bg-primary-50 text-primary-700 rounded text-sm">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 bg-warning-50 text-warning-700 rounded text-sm">
                Configure Two-Factor
              </button>
              <button className="w-full text-left px-3 py-2 bg-danger-50 text-danger-700 rounded text-sm">
                Logout All Sessions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{activity.action}</div>
                <div className="text-sm text-gray-600">{activity.device}</div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;