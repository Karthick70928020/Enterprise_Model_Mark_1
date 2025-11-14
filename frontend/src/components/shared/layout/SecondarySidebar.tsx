import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  KeyIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BellIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const secondaryNavigation = [
  { name: 'Crypto Management', href: '/secondary/crypto', icon: KeyIcon },
  { name: 'Audit Trail', href: '/secondary/audit', icon: DocumentTextIcon },
  { name: 'Compliance', href: '/secondary/compliance', icon: ShieldCheckIcon },
  { name: 'Alert Management', href: '/secondary/alerts', icon: BellIcon },
  { name: 'System Integrity', href: '/secondary/integrity', icon: CpuChipIcon },
];

const SecondarySidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center">
            <KeyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Secondary Device</h2>
            <p className="text-xs text-gray-600">Cryptographic Control</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 px-4">
        <ul className="space-y-2">
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-secondary-50 text-secondary-700 border-r-2 border-secondary-700'
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

      {/* Security Status */}
      <div className="mt-8 px-4">
        <div className="bg-secondary-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary-900 mb-2">Security Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary-700">Keys</span>
              <span className="text-success-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-700">Audit Trail</span>
              <span className="text-success-600 font-medium">Integrity OK</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-700">TOTP</span>
              <span className="text-success-600 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondarySidebar;