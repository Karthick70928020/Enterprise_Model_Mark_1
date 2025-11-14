import React from 'react';
import ComplianceDashboard from '../../components/secondary/compliance/ComplianceDashboard';
import InsuranceReports from '../../components/secondary/compliance/InsuranceReports';
import RegulatoryChecks from '../../components/secondary/compliance/RegulatoryChecks';
import EvidenceGenerator from '../../components/secondary/compliance/EvidenceGenerator';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';

const CompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'insurance' | 'regulatory' | 'evidence'>('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Compliance Dashboard', component: ComplianceDashboard },
    { id: 'insurance', name: 'Insurance Reports', component: InsuranceReports },
    { id: 'regulatory', name: 'Regulatory Checks', component: RegulatoryChecks },
    { id: 'evidence', name: 'Evidence Generator', component: EvidenceGenerator }
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

export default CompliancePage;