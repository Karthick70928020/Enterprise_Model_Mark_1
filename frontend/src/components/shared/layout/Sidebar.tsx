import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  ShieldExclamationIcon,
  CogIcon,
  KeyIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Primary Device', href: '/primary', icon: ChartBarIcon },
  { name: 'Secondary Device', href: '/secondary', icon: KeyIcon },
  { name: 'Threat Monitor', href: '/threats', icon: ShieldExclamationIcon },
  { name: 'Audit Trail', href: '/audit', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
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
    </div>
  );
};

export default Sidebar;