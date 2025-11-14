import React from 'react';
import FirewallManager from '../../components/primary/firewall/FirewallManager';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';

const FirewallManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <DeviceSwitcher />
      <FirewallManager />
    </div>
  );
};

export default FirewallManagementPage;