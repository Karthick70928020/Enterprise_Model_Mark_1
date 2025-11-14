export interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  source: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface SystemAlert {
  id: string;
  component: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
  value: string;
}

export interface IntegrityAlert {
  id: string;
  type: string;
  component: string;
  timestamp: string;
  description: string;
  status: 'investigating' | 'resolved';
  action: string;
}

export interface AlertHistory {
  id: string;
  type: string;
  severity: string;
  timestamp: string;
  resolved: string;
  description: string;
  action: string;
}