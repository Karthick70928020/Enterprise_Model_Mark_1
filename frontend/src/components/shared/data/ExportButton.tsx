import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ExportButtonProps {
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
  disabled?: boolean;
  data?: any[];
  filename?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  disabled = false,
  data = [],
  filename = 'export'
}) => {
  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    if (format === 'csv' && data.length > 0) {
      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
    
    onExport(format);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        disabled={disabled}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Export
      </button>
      
      <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
        <div className="py-1">
          <button
            onClick={() => handleExport('csv')}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Export as JSON
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportButton;