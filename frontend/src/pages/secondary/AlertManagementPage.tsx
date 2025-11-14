import React from 'react';
import SecurityAlerts from '../../components/secondary/alerts/SecurityAlerts';
import SystemAlerts from '../../components/secondary/alerts/SystemAlerts';
import IntegrityAlerts from '../../components/secondary/alerts/IntegrityAlerts';
import AlertHistory from '../../components/secondary/alerts/AlertHistory';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';

const AlertManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'security' | 'system' | 'integrity' | 'history'>('security');

  const tabs = [
    { id: 'security', name: 'Security Alerts', component: SecurityAlerts },
    { id: 'system', name: 'System Alerts', component: SystemAlerts },
    { id: 'integrity', name: 'Integrity Alerts', component: IntegrityAlerts },
    { id: 'history', name: 'Alert History', component: AlertHistory }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      <DeviceSwitcher />
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default AlertManagementPage;