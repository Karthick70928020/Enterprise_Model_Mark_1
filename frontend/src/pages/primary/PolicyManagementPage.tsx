import React from 'react';
import MLModelStatus from '../../components/primary/analysis/MLModelStatus';
import DeviceSwitcher from '../../components/shared/layout/DeviceSwitcher';

const PolicyManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <DeviceSwitcher />
      <MLModelStatus />
    </div>
  );
};

export default PolicyManagementPage;