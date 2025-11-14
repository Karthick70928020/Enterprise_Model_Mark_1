export interface ThreatReport {
  threat_id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  source_ip?: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved' | 'blocked';
}

export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detection_rules: string[];
  mitigation: string[];
  enabled: boolean;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  evidence: string[];
}

export interface AIAnalysis {
  model: 'autoencoder' | 'isolation_forest';
  confidence: number;
  features: string[];
  anomaly_score: number;
  timestamp: string;
}