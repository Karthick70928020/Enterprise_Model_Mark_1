import React from 'react';
import AuditTrail from '../../components/secondary/audit/AuditTrail';
import LogVerification from '../../components/secondary/audit/LogVerification';
import IntegrityChecker from '../../components/secondary/audit/IntegrityChecker';
import ForensicEvidence from '../../components/secondary/audit/ForensicEvidence';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';

const AuditTrailPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'trail' | 'verification' | 'integrity' | 'forensic'>('trail');

  const tabs = [
    { id: 'trail', name: 'Audit Trail', component: AuditTrail },
    { id: 'verification', name: 'Log Verification', component: LogVerification },
    { id: 'integrity', name: 'Integrity Checker', component: IntegrityChecker },
    { id: 'forensic', name: 'Forensic Evidence', component: ForensicEvidence }
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

export default AuditTrailPage;