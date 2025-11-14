import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, ShieldExclamationIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ZeroDayAlert {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  confidence: number;
  status: 'active' | 'investigating' | 'resolved';
  affectedSystems: string[];
  mitigation: string;
}

const ZeroDayAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ZeroDayAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');

  useEffect(() => {
    // Mock zero-day alerts data
    const mockAlerts: ZeroDayAlert[] = [
      {
        id: 'zd-2024-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        severity: 'critical',
        title: 'Zero-Day RCE Vulnerability',
        description: 'Critical remote code execution vulnerability detected in network services',
        confidence: 0.94,
        status: 'active',
        affectedSystems: ['Web Servers', 'API Gateways', 'Load Balancers'],
        mitigation: 'Apply emergency patch and isolate affected systems'
      },
      {
        id: 'zd-2024-002',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        severity: 'high',
        title: 'Privilege Escalation Exploit',
        description: 'New privilege escalation technique targeting system services',
        confidence: 0.87,
        status: 'investigating',
        affectedSystems: ['User Management', 'Authentication Service'],
        mitigation: 'Enhance monitoring and review access controls'
      },
      {
        id: 'zd-2024-003',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        severity: 'medium',
        title: 'Data Exfiltration Pattern',
        description: 'Suspicious data transfer patterns matching known APT behavior',
        confidence: 0.76,
        status: 'active',
        affectedSystems: ['Database Servers', 'File Storage'],
        mitigation: 'Block suspicious IP ranges and enhance DLP rules'
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.status === 'active';
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger-600 bg-danger-50 border-danger-200';
      case 'high': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-danger-100 text-danger-800';
      case 'investigating': return 'bg-warning-100 text-warning-800';
      case 'resolved': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMins}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zero-Day Alerts</h1>
          <p className="text-gray-600">Advanced threat detection and response</p>
        </div>
        <div className="flex items-center space-x-4">
                    {/* Filter Buttons */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Alerts' },
              { key: 'active', label: 'Active' },
              { key: 'critical', label: 'Critical' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === filterOption.key
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Zero-Day</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <ShieldExclamationIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-danger-600">
                {alerts.filter(a => a.severity === 'critical').length}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-danger-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-warning-600">
                {alerts.filter(a => a.status === 'active').length}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-warning-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-success-600">
                {((alerts.reduce((acc, alert) => acc + alert.confidence, 0) / alerts.length) * 100).toFixed(1)}%
              </p>
            </div>
            <ShieldExclamationIcon className="h-8 w-8 text-success-400" />
          </div>
        </div>
      </div>

      {/* Zero-Day Alerts List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Zero-Day Threat Alerts</h2>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No zero-day alerts</h3>
            <p className="mt-1 text-sm text-gray-500">No critical zero-day threats detected.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Affected Systems</p>
                        <div className="flex flex-wrap gap-1">
                          {alert.affectedSystems.map((system, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                            >
                              {system}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Mitigation</p>
                        <p className="text-sm text-gray-600">{alert.mitigation}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {(alert.confidence * 100).toFixed(0)}% Confidence
                    </div>
                    <div className="text-xs text-gray-500">
                      {getTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-danger-600 text-white text-sm rounded hover:bg-danger-700">
                      Quarantine
                    </button>
                    <button className="px-3 py-1 bg-warning-600 text-white text-sm rounded hover:bg-warning-700">
                      Investigate
                    </button>
                    <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                      Deploy Patch
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">Alert ID: {alert.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Threat Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <h3 className="font-medium text-primary-900 mb-2">Behavioral Analysis</h3>
              <p className="text-sm text-primary-700">
                AI models detecting anomalous patterns across {alerts.length} attack vectors with 94.3% accuracy.
              </p>
            </div>
            
            <div className="p-4 bg-warning-50 rounded-lg">
              <h3 className="font-medium text-warning-900 mb-2">Threat Intelligence</h3>
              <p className="text-sm text-warning-700">
                Correlated with 3 external threat feeds and 12 internal security controls.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-success-50 rounded-lg">
              <h3 className="font-medium text-success-900 mb-2">Automated Response</h3>
              <p className="text-sm text-success-700">
                Automated containment procedures active. Response time: &lt;18.7ms for critical threats.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Forensic Readiness</h3>
              <p className="text-sm text-gray-700">
                All incidents logged with cryptographic proof for insurance and compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroDayAlerts;