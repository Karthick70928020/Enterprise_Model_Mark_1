import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
  }[];
  placeholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters = [],
  placeholder = 'Search...'
}) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder={placeholder}
            />
          </div>
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            {filters.map((filter) => (
              <select
                key={filter.key}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">All {filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;