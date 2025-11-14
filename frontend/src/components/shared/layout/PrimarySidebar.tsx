import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  ShieldExclamationIcon,
  FireIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const primaryNavigation = [
  { name: 'Network Monitor', href: '/primary/network', icon: ChartBarIcon },
  { name: 'Threat Analysis', href: '/primary/threats', icon: ShieldExclamationIcon },
  { name: 'Firewall Management', href: '/primary/firewall', icon: FireIcon },
  { name: 'Policy Management', href: '/primary/policies', icon: WrenchScrewdriverIcon },
  { name: 'System Health', href: '/primary/health', icon: CpuChipIcon },
];

const PrimarySidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <CpuChipIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Primary Device</h2>
            <p className="text-xs text-gray-600">AI Security Engine</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 px-4">
        <ul className="space-y-2">
          {primaryNavigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* System Status */}
      <div className="mt-8 px-4">
        <div className="bg-primary-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-900 mb-2">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary-700">Threat Level</span>
              <span className="text-primary-900 font-medium">Low</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary-700">AI Models</span>
              <span className="text-success-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary-700">Packets/Sec</span>
              <span className="text-primary-900 font-medium">156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimarySidebar;