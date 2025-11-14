import React from 'react';
import KeyVault from '../../components/secondary/crypto/KeyVault';
import SignatureMonitor from '../../components/secondary/crypto/SignatureMonitor';
import TOTPManager from '../../components/secondary/crypto/TOTPManager';
import HashChainViewer from '../../components/secondary/crypto/HashChainViewer';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';

const CryptoManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'keys' | 'signatures' | 'totp' | 'chain'>('keys');

  const tabs = [
    { id: 'keys', name: 'Key Vault', component: KeyVault },
    { id: 'signatures', name: 'Signature Monitor', component: SignatureMonitor },
    { id: 'totp', name: 'TOTP Manager', component: TOTPManager },
    { id: 'chain', name: 'Hash Chain', component: HashChainViewer }
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

export default CryptoManagementPage;