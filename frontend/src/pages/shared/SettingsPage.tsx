import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useConfigStore } from '../../stores/configStore';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { config, updateConfig } = useConfigStore();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const handleSaveNotifications = () => {
    // Save notification preferences
    console.log('Saving notification settings:', notifications);
  };

  const handleSaveSecurity = () => {
    // Save security settings
    console.log('Saving security settings:', security);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <button className="btn-primary">
              Update Profile
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-600">Receive alerts via email</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Push Notifications</div>
                <div className="text-sm text-gray-600">Browser push notifications</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">SMS Alerts</div>
                <div className="text-sm text-gray-600">Critical alerts via SMS</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <button onClick={handleSaveNotifications} className="btn-primary">
              Save Preferences
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Require TOTP for login</div>
              </div>
              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={(e) => setSecurity({...security, twoFactor: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Expiry (days)</label>
              <select
                value={security.passwordExpiry}
                onChange={(e) => setSecurity({...security, passwordExpiry: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
              </select>
            </div>
            <button onClick={handleSaveSecurity} className="btn-primary">
              Update Security
            </button>
          </div>
        </div>

        {/* System Preferences */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Zone</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>CET</option>
              </select>
            </div>
            <button className="btn-primary">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;