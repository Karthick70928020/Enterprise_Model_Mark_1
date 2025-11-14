export interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'block' | 'log';
  priority: number;
  condition: RuleCondition;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface RuleCondition {
  type: 'ip_blocklist' | 'protocol' | 'port_blocklist' | 'custom';
  values: string[];
  operator?: 'equals' | 'contains' | 'matches';
}

export interface FirewallLog {
  log_id: string;
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  decision: string;
  matched_rule?: string;
  packet_size: number;
}

export interface DLPPolicy {
  id: string;
  name: string;
  description: string;
  patterns: string[];
  action: 'block' | 'alert' | 'quarantine';
  sensitivity: 'low' | 'medium' | 'high';
  enabled: boolean;
}